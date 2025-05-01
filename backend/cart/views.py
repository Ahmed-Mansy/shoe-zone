from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Product, Cart, CartItem
# Create your views here.

class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        product = get_object_or_404(Product, id=product_id)
        cart, _ = Cart.objects.get_or_create(user=request.user)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()

        return Response({'message': 'Product added to cart'}, status=status.HTTP_200_OK)


class CartItemDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, item_id):  # Use PUT or PATCH for updates
        new_quantity = int(request.data.get('quantity', 1))
        cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)

        if new_quantity > 0:
            cart_item.quantity = new_quantity
            cart_item.save()
            return Response({'message': 'Quantity updated', 'quantity': cart_item.quantity})
        else:
            cart_item.delete()
            return Response({'message': 'Item removed because quantity was 0'})

    def delete(self, request, item_id):  # Use DELETE method for deletion
        cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
        cart_item.delete()
        return Response({'message': 'Item removed from cart'}, status=status.HTTP_204_NO_CONTENT)


class ViewCartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart_items = cart.items.select_related('product').all()

        if not cart_items.exists():
            return Response({"message":"Your cart is empty !"},status=200)
        
        items = []
        total_price = 0

        for item in cart_items:
            item_total = item.product.price * item.quantity
            total_price += item_total
            items.append({
                'id': item.id,
                'product_name': item.product.name,
                'product_price': float(item.product.price),
                'quantity': item.quantity,
                'total': float(item_total)
            })

        return Response({
            'items': items,
            'total_price': float(total_price)
        })

