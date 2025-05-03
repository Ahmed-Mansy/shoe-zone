from rest_framework import serializers
from .models import Order, OrderItem, Product


class OrderItemSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product'
    )

    class Meta:
        model = OrderItem
        fields = ['product_id', 'quantity', 'price']

    def validate(self, data):
        product = data['product']
        quantity = data['quantity']

        # Check if the product exists and has enough stock
        if product.stock < quantity:
            raise serializers.ValidationError(
                f"Not enough stock for {product.name}. Available: {product.stock}"
            )

        # Ensure price matches the product's current price
        if data['price'] != product.price:
            raise serializers.ValidationError(
                f"Price mismatch for {product.name}. Expected: {product.price}, Got: {data['price']}"
            )

        return data

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    user = serializers.StringRelatedField(read_only=True)
    payment_method = serializers.ChoiceField(choices=['cod', 'online'])


    class Meta:
        model = Order
        fields = ['id', 'user', 'total_amount', 'status', 'shipping_address', 'payment_status', 'items', 'created_at']
        read_only_fields = ['id', 'user', 'total_amount', 'status', 'created_at']

    def validate(self, data):
        # Validate that there are items in the order
        if not data.get('items'):
            raise serializers.ValidationError("An order must contain at least one item.")

        # Validate shipping address
        if not data.get('shipping_address'):
            raise serializers.ValidationError("Shipping address is required.")

        return data

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        # Calculate total amount
        total_amount = sum(item['quantity'] * item['price'] for item in items_data)
        validated_data['total_amount'] = total_amount

        # Set the user to the authenticated user
        validated_data['user'] = self.context['request'].user

        # Create the order
        order = Order.objects.create(**validated_data)

        # Create order items
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)

            # Update product stock
            product = item_data['product']
            product.stock -= item_data['quantity']
            product.save()

        return order