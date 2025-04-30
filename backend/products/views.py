from rest_framework import viewsets
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .models import Product, Category,Rating, ProductImage
from .serializers import ProductSerializer, CategorySerializer
from .filters import ProductFilter
from django.db.models import Q
from .serializers import RatingSerializer
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

# For category CRUD operations
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# For product search and filtering ONLY
class ProductListView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'material', 'colors']
    

# For product CRUD operations (if needed)
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Only a  dmin can create, update, delete products and all users can view products
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        # Save the product instance
        product = serializer.save()

        # Add images for the created product
        images = self.request.FILES.getlist('images')
        for img in images:
            ProductImage.objects.create(product=product, image=img)

    def perform_update(self, serializer):
        # Update the product instance
        product = serializer.save()

        # Add new images for the updated product
        images = self.request.FILES.getlist('images')
        for img in images:
            ProductImage.objects.create(product=product, image=img)


# For product details (NEW)
class ProductDetailView(APIView):

    def get(self, request, pk):
        try:
            product = Product.objects.get(id=pk)
            serializer = ProductSerializer(product, many=False)
            
            product_data = serializer.data
            product_data['has_discount'] = product.discount_price is not None and product.discount_price < product.price
            product_data['available_sizes'] = [size.strip() for size in product.sizes.split(',')] if product.sizes else []
            product_data['available_colors'] = [color.strip() for color in product.colors.split(',')] if product.colors else []

            return Response(product_data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)


class RatingListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, product_id):
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {"error": "The specified product does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )

        ratings = Rating.objects.filter(product=product)
        serializer = RatingSerializer(ratings, many=True)

        response_data = {
            "avg_rating": product.avg_rating,  # Assuming the product model has an avg_rating field
            "ratings": serializer.data,
        }
        return Response(response_data, status=status.HTTP_200_OK)

    def post(self, request, product_id):
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {"error": "The specified product does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = RatingSerializer(data=request.data, context={'request': request, 'product': product})
        if serializer.is_valid():
            serializer.save(user=request.user)  # Assuming user is related to Rating model
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)