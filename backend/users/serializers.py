from rest_framework import serializers
from .models import *
import re
from rest_framework.fields import ImageField
# from django.contrib.auth.models import User 
from rest_framework_simplejwt.tokens import RefreshToken


class UserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(use_url=True)
    name=serializers.SerializerMethodField(read_only=True)
    _id=serializers.SerializerMethodField(read_only=True)
    isAdmin=serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = [
            'id',
            '_id',
            'name',
            'isAdmin',
            'username',
            'first_name',
            'last_name',
            'email',
            'mobile',
            'profile_picture',
            'birthdate',
            'facebook_profile',
            'country',
        ]
        
    def get_name(self,obj):
        firstname=obj.first_name
        lastname=obj.last_name
        name=firstname+' '+lastname
        if name=='':
            name=obj.email[:5]
            return name
        return name
    
    def get__id(self,obj):
        return obj.id

    def get_isAdmin(self,obj):
        return obj.is_staff

class UserSerializerWithToken(UserSerializer):
    token=serializers.SerializerMethodField(read_only=True)
    class Meta:
        model=User
        fields=['id','_id','username','email','name','isAdmin','token']
    
    def get_token(self,obj):
        token=RefreshToken.for_user(obj)
        return str(token.access_token)



class UserUpdateSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        kwargs['partial'] = True
        super().__init__(*args, **kwargs)
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'mobile',
            'profile_picture',
            'birthdate',
            'facebook_profile',
            'country',
        ]
        extra_kwargs = {
            'profile_picture': {'required': False, 'allow_null': True},
        }

    def validate_mobile(self, value):
        if value in [None, '']:
                raise serializers.ValidationError("Mobile field is required.")
        pattern = r'^(010|011|012|015)[0-9]{8}$'
        if not re.match(pattern, value):
            raise serializers.ValidationError("Invalid Egyptian mobile number.")
        return value
    def validate_first_name(self, value):
        if value in [None, '']:
            raise serializers.ValidationError("First name is required.")
        if not re.search(r'[A-Za-z]', value):
            raise serializers.ValidationError("First name must contain letters, not only numbers.")
        return value
    
    def validate_last_name(self, value):
        if value in [None, '']:
            raise serializers.ValidationError("Last name is required.")
        if not re.search(r'[A-Za-z]', value):
            raise serializers.ValidationError("Last name must contain letters, not only numbers.")
        return value
    
    def validate_profile_picture(self, value):
        if value is None:
            return value 
        return value
    
    def update(self, instance, validated_data):
        for attr in self.Meta.fields:
            if attr == 'id':
                continue  
            if attr == 'profile_picture':
                if 'profile_picture' not in validated_data:
                    continue
                if validated_data.get('profile_picture') in [None, '', []]:
                    continue

            if attr in validated_data:
                value = validated_data.get(attr)
                setattr(instance, attr, value)
            
            
        instance.save()
        return instance
    
class DeleteAccountSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    password = serializers.CharField(write_only=True)
    def validate(self, attrs):
        password = attrs.get('password')
        request = self.context.get('request')

        user = request.user
        if not user.check_password(password):
            raise serializers.ValidationError({"password": "Incorrect password."})

        return attrs
