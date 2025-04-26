# users/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import User
from .serializers import UserSerializer, DeleteAccountSerializer, UserUpdateSerializer
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated 
from django.contrib.auth.hashers import make_password
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        return User.objects.filter(is_superuser=False)

    @action(detail=True, methods=['patch'])
    def block(self, request, pk=None):
        user = self.get_object()
        user.is_active = False
        user.save()
        return Response({'status': 'user blocked'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'])
    def unblock(self, request, pk=None):
        user = self.get_object()
        user.is_active = True
        user.save()
        return Response({'status': 'user unblocked'}, status=status.HTTP_200_OK)



class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, id):
        user = get_object_or_404(User, id=id)

        if request.user.id != user.id:
            return Response({"error": "You are not authorized to view this profile."}, status=status.HTTP_403_FORBIDDEN)

        user_data = UserSerializer(user).data

        return Response({
            "user": user_data,
        }, status=status.HTTP_200_OK)
    
class User_Update_Delete(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def put(self, request, id):
        user = get_object_or_404(User, id=id)
        data = request.data

        serializer = UserUpdateSerializer(instance=user, data=request.data)

        if user:
            if request.user.id == user.id:
                user.username = data["username"]
                user.email = data["email"]
            if serializer.is_valid():
                if data.get("password", "") != "":
                    user.password = make_password(data["password"])

                user.save()
                serializer = UserSerializer(user, many=False)
                message = {"details": "User Successfully Updated.", "user": serializer.data}
                return Response(message, status=status.HTTP_200_OK)
            else:
                return Response({"details": "Permission Denied."}, status.status.HTTP_403_FORBIDDEN)
            
    def delete(self, request, id):
        user = User.objects.get(id=id)
        
        if request.user.id != user.id:
            return Response(
                {"error": "You are not authorized to delete this account."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = DeleteAccountSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            user.delete()
            return Response(
                {"message": "Account deleted successfully."},
                status=status.HTTP_200_OK
            )
            
        return Response({"errors": serializer.errors},status=status.HTTP_400_BAD_REQUEST)