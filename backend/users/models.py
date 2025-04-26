from calendar import c
from django.db import models

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    mobile = models.CharField(max_length=15, unique=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    birthdate = models.DateField(blank=True, null=True)
    facebook_profile = models.URLField(blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)


    def __str__(self):
        return self.username