from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)
# urlpatterns = [
#     path('crud/', include(router.urls)),
#     path('api/products/', ProductListView.as_view(), name='product-list'), 
#     path('products/<int:product_id>/ratings/', RatingListCreateView.as_view(), name='rating-list-create'),
# ]

urlpatterns = [
    path('crud/', include(router.urls)),
    path('api/products/', ProductListView.as_view(), name='product-list'), 
    path('products/<int:product_id>/ratings/', RatingListCreateView.as_view(), name='rating-list-create'),
    path('product/<int:pk>/', ProductDetailView.as_view(), name="product-details"),
    # path('product/create/', ProductCreateView.as_view(), name="product-create"),
    # path('product/update/<int:pk>/',ProductEditView.as_view(), name="product-update"),
    # path('product/delete/<int:pk>/',ProductDeleteView.as_view(), name="product-delete"),

]
