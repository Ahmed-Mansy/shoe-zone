from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Product, Rating
from .serializers import RatingSerializer

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
