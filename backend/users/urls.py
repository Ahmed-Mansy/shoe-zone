from django.contrib import admin
from django.urls import path, include
from .views import *

urlpatterns = [
    path('user/<int:id>/', User_Update_Delete.as_view()),
    path('profile/<int:id>/', ProfileView.as_view(), name='user_profile'),
]
