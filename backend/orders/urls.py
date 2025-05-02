from django.contrib import admin
from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register('orders', OrderViewSet)

urlpatterns = [
    path('admin-dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),
    path('crud/', include(router.urls)),
    path('create/', createOrder, name='create_order'),

]
