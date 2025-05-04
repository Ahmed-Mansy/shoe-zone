from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product

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

        # Check stock availability
        if product.stock_quantity < quantity:
            raise serializers.ValidationError(
                f"Not enough stock for {product.name}. Available: {product.stock_quantity}"
            )

        # Check price consistency
        if 'price' in data and data['price'] != product.price:
            raise serializers.ValidationError(
                f"Price mismatch for {product.name}. Expected: {product.price}, Got: {data['price']}"
            )

        return data

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Order

        fields = ['id', 'user', 'total_price', 'status', 'shipping_address', 'is_paid', 'items', 'created_at']
        read_only_fields = ['id', 'user', 'total_price', 'status', 'created_at', 'is_paid']

    def validate(self, data):
        if not data.get('items'):
            raise serializers.ValidationError("An order must contain at least one item.")
        if not data.get('shipping_address'):
            raise serializers.ValidationError("Shipping address is required.")
        return data

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        validated_data['user'] = self.context['request'].user
        order = Order.objects.create(**validated_data)

        # Create order items
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)

        return order