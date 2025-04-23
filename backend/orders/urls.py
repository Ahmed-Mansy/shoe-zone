from django.contrib import admin
from django.urls import path, include
from .views import *

urlpatterns = [
    path('admin-dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),

]
