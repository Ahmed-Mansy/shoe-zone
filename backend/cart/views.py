from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Product, Cart, CartItem
from products.models import ProductImage

class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        product = get_object_or_404(Product, id=product_id)
        cart, _ = Cart.objects.get_or_create(user=request.user)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

        new_quantity = quantity if created else cart_item.quantity + quantity

        if new_quantity > product.stock_quantity:
            return Response(
                {'error': f'Only {product.stock_quantity} items available in stock'},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item.quantity = new_quantity
        cart_item.save()

        price = product.discount_price if product.discount_price else product.price
        total = price * cart_item.quantity

        return Response({
            'message': 'Product added to cart',
            'item': {
                'product_name': product.name,
                'quantity': cart_item.quantity,
                'price': float(price),
                'total': float(total)
            }
        }, status=status.HTTP_200_OK)



class CartItemDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, item_id):
        cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
        product = cart_item.product

        image_obj = ProductImage.objects.filter(product=product).first()
        image_url = request.build_absolute_uri(image_obj.image.url) if image_obj and image_obj.image else None

        price = product.discount_price if product.discount_price else product.price
        total = price * cart_item.quantity

        item_data = {
            'id': cart_item.id,
            'product_name': product.name,
            'product_price': float(price),
            'quantity': cart_item.quantity,
            'total': float(total),
            'product_image': image_url,
        }

        return Response(item_data, status=status.HTTP_200_OK)

    def put(self, request, item_id):
        new_quantity = int(request.data.get('quantity', 1))
        cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
        product = cart_item.product

        # ✅ تحقق من توفر الكمية في المخزون
        if new_quantity > product.stock_quantity:
            return Response(
                {'error': f'Only {product.stock_quantity} items available in stock'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if new_quantity > 0:
            cart_item.quantity = new_quantity
            cart_item.save()
            return Response({'message': 'Quantity updated', 'quantity': cart_item.quantity})
        else:
            cart_item.delete()
            return Response({'message': 'Item removed because quantity was 0'})

    def delete(self, request, item_id):
        cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
        cart_item.delete()
        return Response({'message': 'Item removed from cart'}, status=status.HTTP_204_NO_CONTENT)
class ViewCartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart_items = cart.items.select_related('product').all()

        if not cart_items.exists():
            return Response({"message": "Your cart is empty!"}, status=status.HTTP_200_OK)

        items = []
        total_price = 0

        for item in cart_items:
            product = item.product
            price = product.discount_price if product.discount_price else product.price
            item_total = price * item.quantity
            total_price += item_total

            # Get first image for the product
            image_obj = ProductImage.objects.filter(product=product).first()
            image_url = request.build_absolute_uri(image_obj.image.url) if image_obj and image_obj.image else None

            items.append({
                'id': item.id,
                'product_name': product.name,
                'product_price': float(price),
                'quantity': item.quantity,
                'stock_quantity': product.stock_quantity,            
                'total': float(item_total),
                'product_image': image_url,
            })

        return Response({
            'items': items,
            'total_price': float(total_price)
        }, status=status.HTTP_200_OK)

