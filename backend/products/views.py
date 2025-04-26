from rest_framework import viewsets
from rest_framework.generics import ListAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .models import Product, Category,Rating
from .serializers import ProductSerializer, CategorySerializer
from .filters import ProductFilter
from django.db.models import Q
from .serializers import RatingSerializer
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status



# For category CRUD operations
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

# For product search and filtering ONLY
class ProductListView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'material', 'colors', 'sizes']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        search_term = self.request.query_params.get('search', None)
        
        if search_term:
            queryset = queryset.filter(
                Q(name__icontains=search_term) | 
                Q(description__icontains=search_term) |
                Q(material__icontains=search_term) |
                Q(colors__icontains=search_term) |
                Q(sizes__icontains=search_term)
            ).distinct()
        return queryset

# For product CRUD operations (if needed)
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


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