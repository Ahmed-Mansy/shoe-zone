# users/views.py
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from .models import User,Address
from .serializers import (UserSerializer, DeleteAccountSerializer, UserUpdateSerializer, UserSerializerWithToken,AddressSerializer,AddressUpdateSerializer)
from django.shortcuts import get_object_or_404, render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.hashers import make_password
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser

# from django.contrib.auth.models import User
# from .serializers import SignUpSerializer,UserSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# for sending mails and generate token
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from .utils import TokenGenerator,generate_token
from django.utils.encoding import force_bytes, DjangoUnicodeDecodeError
from django.core.mail import EmailMessage
from django.conf import settings
from django.views.generic import View
from smtplib import SMTPException


@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name=data['first_name'],
            last_name=data['last_name'],
            username=data['email'],
            email=data['email'],
            password=data['password'],
            is_active=False
        )
        # Generate token for sending mail
        email_subject = "Activate Your Account"
        domain = request.build_absolute_uri('/')[:-1]
        message = render_to_string(
            "activate.html",
            {
                'user': user,
                'domain': domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': generate_token.make_token(user)
            }
        )
        email_message = EmailMessage(
            email_subject, message, settings.EMAIL_HOST_USER, [data['email']]
        )
        email_message.content_subtype = "html"
        email_message.send()
        serialize = UserSerializerWithToken(user, many=False)
        return Response(serialize.data)
    except SMTPException as e:
        message = {'details': 'Failed to send email. Please check your email configuration.'}
        print(f"SMTPException: {e}")
        return Response(message, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        message = {'details': str(e)}
        print(e)
        return Response(message, status=status.HTTP_400_BAD_REQUEST)



# class ActivateAccountView(APIView):
#     def get(self,request,uidb64,token):
#         try:
#             # uid=str(urlsafe_base64_decode(uidb64))
#             # user=User.objects.get(pk=uid)
#             uid_bytes = urlsafe_base64_decode(uidb64)  # Returns b'16'
#             uid_str = uid_bytes.decode('utf-8')  # Converts b'16' to "16"
#             uid = int(uid_str)  # Converts "16" to 16
#             user=User.objects.get(pk=uid)
            
#         except (TypeError, ValueError, OverflowError, User.DoesNotExist) as e:
#             user=None
#             print(f"Error decoding UID or retrieving user: {e}")  # Debug
#             return Response({"detail": "Invalid user or UID"}, status=400)
#         if user is not None and generate_token.check_token(user,token):
#             user.is_active=True
#             user.save()
#             return Response({"detail": "Account activated successfully"}, status=200)
#         else:
#             print(f"Token validation failed for user {user}")  # Debug
#             return Response({"detail": "Invalid or expired token"}, status=400)  


class ActivateAccountView(APIView):
    def get(self, request, uidb64, token):
        user = None  # Initialize user to None
        try:
            # Decode uidb64 to get the user ID
            print(f"Received uidb64: {uidb64}")  # Debug
            uid_bytes = urlsafe_base64_decode(uidb64)  # Returns b'18'
            print(f"Decoded uid_bytes: {uid_bytes}")  # Debug
            uid_str = uid_bytes.decode('utf-8')  # Converts b'18' to "18"
            print(f"Decoded uid_str: {uid_str}")  # Debug
            uid = int(uid_str)  # Converts "18" to 18
            print(f"Final uid: {uid}")  # Debug
            user = User.objects.get(pk=uid)
            print(f"Found user: {user}")  # Debug
        except (TypeError, ValueError, OverflowError, User.DoesNotExist) as error:
            print(f"Error decoding UID or retrieving user: {error}")  # Debug
            return Response({"detail": "Invalid user or UID"}, status=400)

        if user is not None and generate_token.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({"detail": "Account activated successfully"}, status=200)
        else:
            print(f"Token validation failed for user {user if user is not None else 'None'}")  # Debug
            return Response({"detail": "Invalid or expired token"}, status=400)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer=UserSerializerWithToken(self.user).data
        for k,v in serializer.items():
            data[k]=v
        return data 


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def  getUserProfiles(request):
    user=request.user
    serializer=UserSerializer(user,many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users=User.objects.all()
    serializer=UserSerializer(users,many=True)
    return Response(serializer.data)




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
    # permission_classes = [IsAuthenticated]
    def get(self, request, id):
        user = get_object_or_404(User, id=id)

        # if request.user.id != user.id:
        #     return Response({"error": "You are not authorized to view this profile."}, status=status.HTTP_403_FORBIDDEN)

        user_data = UserSerializer(user).data

        return Response({
            "user": user_data,
        }, status=status.HTTP_200_OK)
    
class User_Update_Delete(APIView):
    # permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def put(self, request, id):
        user = get_object_or_404(User, id=id)

        serializer = UserUpdateSerializer(instance=user, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(data={
        "errors": serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)  
            
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
    
    # ============ Address APIs ============

class AddressCreateView(generics.CreateAPIView):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer


class AddressListView(generics.ListAPIView):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer

@api_view(['PUT'])
# @permission_classes([IsAuthenticated])
def update_address(request):
    try:
        address = Address.objects.get(user=request.user)
    except Address.DoesNotExist:
        return Response({'error': 'Address not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = AddressUpdateSerializer(address)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = AddressUpdateSerializer(address, data=request.data)
        if serializer.is_valid():
            address.country = serializer.validated_data.get('country')
            address.city = serializer.validated_data.get('city')
            address.address_line_1 = serializer.validated_data.get('street')
            address.postcode = serializer.validated_data.get('postcode')
            address.save()
            return Response(AddressUpdateSerializer(address).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)