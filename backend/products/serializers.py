from rest_framework import serializers
from .models import Product, Category, ProductImage,Rating
from reviews.models import Review



class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name'] 

class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image_url', 'image'] 

class RatingSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Rating
        fields = ['id', 'user', 'product', 'score']
        read_only_fields = ['id', 'user', 'product']

    def validate_score(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("The rating score must be between 1 and 5.")
        return value

    def create(self, validated_data):
        product = self.context.get('product')
        validated_data['product'] = product
        return super().create(validated_data)

    def validate(self, data):
        user = self.context['request'].user
        product = self.context.get('product')
        if Rating.objects.filter(user=user, product=product).exists():
            raise serializers.ValidationError("You have already rated this product.")
        return data
    
class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Review
        fields = ['id', 'user', 'product', 'comment', 'rating', 'created_at']
        read_only_fields = ['id', 'user', 'product', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    reviews = ReviewSerializer(many=True, read_only=True)
    ratings = RatingSerializer(many=True, read_only=True)

    # Add calculated fields for frontend
    has_discount = serializers.SerializerMethodField()
    available_sizes = serializers.SerializerMethodField()
    available_colors = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'discount_price',
            'stock_quantity', 'category', 'category_id', 'images',
            'average_rating', 'material', 'sizes', 'colors',
            'has_discount', 'available_sizes', 'available_colors',
            'reviews','ratings'
        ]
        extra_kwargs = {
            'sizes': {'write_only': True},  # Hide raw sizes from responses
            'colors': {'write_only': True}   # Hide raw colors from responses
        }

    def get_has_discount(self, obj):
        return obj.discount_price is not None and obj.discount_price < obj.price

    def get_available_sizes(self, obj):
        return [size.strip() for size in obj.sizes.split(',')] if obj.sizes else []

    def get_available_colors(self, obj):
        return [color.strip() for color in obj.colors.split(',')] if obj.colors else []