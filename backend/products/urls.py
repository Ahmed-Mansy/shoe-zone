from django.contrib import admin
from django.urls import path, include
from .views import *


urlpatterns = [
    path('products/<int:product_id>/ratings/', RatingListCreateView.as_view(), name='rating-list-create'),
]
