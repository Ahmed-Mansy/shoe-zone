from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('crud/', include(router.urls)),
    path('api/products/', ProductListView.as_view(), name='product-list'), 
    path('products/<int:id>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/<int:product_id>/ratings/', RatingListCreateView.as_view(), name='rating-list-create'),path('type/<str:type>/', ProductsByTypeView.as_view(), name='products-by-type'),
    path('categories/type/<str:type>/', CategoryByTypeView.as_view(), name='categories-by-type'),
    path('type/<str:type>/<str:category>/', ProductsByTypeAndCategoryView.as_view(), name='products-by-category'),
    path('home/', HomeProductsView.as_view(), name='home-products'),

]

