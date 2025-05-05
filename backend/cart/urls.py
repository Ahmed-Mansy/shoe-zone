from django.urls import path
from .views import AddToCartView, CartItemDetailView, ViewCartView, ClearCartView

urlpatterns = [
    path('add/', AddToCartView.as_view()),  # POST
    path('view/', ViewCartView.as_view()),  # GET
    path('item/<int:item_id>/', CartItemDetailView.as_view()),  # PUT, DELETE
    path('clear/', ClearCartView.as_view(), name='clear_cart'),  # DELETE
]