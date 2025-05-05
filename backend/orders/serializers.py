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
        extra_kwargs = {'price': {'required': False}}

    def validate(self, data):
        product = data['product']
        quantity = data['quantity']
        if product.stock_quantity < quantity:
            raise serializers.ValidationError(
                f"Not enough stock for {product.name}. Available: {product.stock_quantity}"
            )
        return data

    def create(self, validated_data):
        validated_data['price'] = validated_data['product'].price
        return super().create(validated_data)

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'total_price', 'status', 'shipping_address', 'is_paid', 'items', 'created_at', 'payment_status']
        read_only_fields = ['id', 'user', 'status', 'created_at', 'is_paid']

    def validate(self, data):
        if not data.get('items'):
            raise serializers.ValidationError("An order must contain at least one item.")
        if not data.get('shipping_address'):
            raise serializers.ValidationError("Shipping address is required.")
        if data.get('payment_status') not in ['cod', 'stripe']:
            raise serializers.ValidationError("Invalid payment method. Choose 'cod' or 'stripe'.")
        return data

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        validated_data['user'] = self.context['request'].user
        order = Order.objects.create(**validated_data)
        total_price = 0
        for item_data in items_data:
            item = OrderItem.objects.create(order=order, **item_data)
            total_price += item.price * item.quantity
        order.total_price = total_price
        order.save()
        return order
    

class OrderSerializer2(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    class Meta:
        model = Order
        fields = '__all__'
