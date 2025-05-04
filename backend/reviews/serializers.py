from rest_framework import serializers
from .models import Review, ReviewReply
from products.models import Product
from django.contrib.auth import get_user_model

User = get_user_model()

class ReviewSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    product_name = serializers.SerializerMethodField()
    user_id = serializers.IntegerField(source='user.id', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user_id','full_name', 'product', 'rating', 'comment', 'created_at', 'product_name']
        read_only_fields = ['id', 'created_at', 'full_name', 'product']

    def get_full_name(self, obj):
        first = obj.user.first_name or ''
        last = obj.user.last_name or ''
        full_name = f"{first} {last}".strip()
        return full_name if full_name else obj.user.username  # fallback لو الاسم فاضي

    def get_product_name(self, obj):
        return obj.product.name if obj.product else None

    def create(self, validated_data):
        product_id = self.context.get('product_id')
        if not Product.objects.filter(id=product_id).exists():
            raise serializers.ValidationError("The specified product does not exist.")

        product = Product.objects.get(id=product_id)
        validated_data['product'] = product

        user = self.context.get('user')
        if not user:
            raise serializers.ValidationError("User not found in context.")

        validated_data['user'] = user

        if Review.objects.filter(product=product, user=user).exists():
            raise serializers.ValidationError("You have already submitted a review for this product.")

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