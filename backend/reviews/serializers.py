from rest_framework import serializers
from .models import Review, ReviewReply
from products.models import Product
from django.contrib.auth import get_user_model

User = get_user_model()

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  
    product_name = serializers.SerializerMethodField()  

    class Meta:
        model = Review
        fields = ['id', 'user', 'product', 'rating', 'comment', 'created_at', 'product_name']
        read_only_fields = ['id', 'created_at', 'user', 'product']

    def get_product_name(self, obj):
        return obj.product.name if obj.product else None

    def create(self, validated_data):
        product_id = self.context.get('product_id')
        if not Product.objects.filter(id=product_id).exists():
            raise serializers.ValidationError("The specified product does not exist.")
        validated_data['product'] = Product.objects.get(id=product_id)
        return super().create(validated_data)

    def validate_comment(self, value):
        if not value.strip():
            raise serializers.ValidationError("The review comment cannot be empty.")
        return value

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value
    
class ReviewReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewReply
        fields = ['id', 'user', 'review', 'text', 'created_at']
        read_only_fields = ['id', 'created_at', 'user']