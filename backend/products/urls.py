from django.contrib import admin
from django.urls import path, include
from .views import *

urlpatterns = [
    path('api/products/', ProductListView.as_view(), name='product-list'),
]
