# users/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from .models import User
from .serializers import UserSerializer, DeleteAccountSerializer, UserUpdateSerializer, UserSerializerWithToken
from django.shortcuts import get_object_or_404, render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser , AllowAny
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
from django.utils.encoding import force_bytes, DjangoUnicodeDecodeError ,force_str
from django.core.mail import EmailMessage
from django.conf import settings
from django.views.generic import View
from smtplib import SMTPException

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail


@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name=data['first_name'],
            last_name=data['last_name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password']),
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
    
    
    # Password Reset Request
@api_view(['POST'])
@permission_classes([AllowAny])
def passwordResetRequest(request):
    email = request.data.get('email')
    if not email:
        return Response({"details": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        # Generate token and UID
        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        # Build the reset link
        domain = request.build_absolute_uri('/')[:-1]  # e.g., http://127.0.0.1:8000
        reset_url = f"{domain}/api/users/password-reset-confirm/?uid={uid}&token={token}"

        # Send a plain text email
        email_subject = "Password Reset Request"
        email_message = (
            f"Hello {user.email},\n\n"
            f"You requested a password reset for your account. Use the following link to reset your password:\n"
            f"{reset_url}\n\n"
            f"If you did not request a password reset, please ignore this email.\n\n"
            f"Thanks,\nThe Shoe-Zone Team"
        )

        send_mail(
            email_subject,
            email_message,
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )

        # Return the reset URL in the response for the frontend (optional)
        return Response({
            "details": "Password reset email sent successfully.",
            "reset_url": reset_url  # Optional: for frontend to display or handle
        })
    except User.DoesNotExist:
        # Don't reveal whether the email exists for security reasons
        return Response({"details": "Password reset email sent if the email exists."})
    except SMTPException as e:
        print(f"SMTPException: {e}")
        return Response(
            {"details": "Failed to send email. Please check your email configuration."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        print(e)
        return Response({"details": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Password Reset Confirm
@api_view(['POST'])
@permission_classes([AllowAny])
def passwordResetConfirm(request):
    uidb64 = request.data.get('uid')
    token = request.data.get('token')
    new_password = request.data.get('new_password')

    if not (uidb64 and token and new_password):
        return Response(
            {"details": "UID, token, and new password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Decode the UID and get the user
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)

        # Verify the token
        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(user, token):
            return Response(
                {"details": "Invalid or expired token."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update the password
        user.set_password(new_password)
        user.save()

        return Response({"details": "Password reset successfully."})
    except (User.DoesNotExist, ValueError, TypeError):
        return Response(
            {"details": "Invalid UID or user does not exist."},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        print(e)
        return Response({"details": str(e)}, status=status.HTTP_400_BAD_REQUEST)