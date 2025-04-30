from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from .models import Review, ReviewReply, Report
from .serializers import ReviewSerializer, ReviewReplySerializer
from products.models import Product  

class ReviewListCreateView(APIView):
    """
    Handles listing all reviews for a product and creating a new review.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, product_id):
        product = Product.objects.get(id=product_id)

        
        reviews = Review.objects.filter(product=product)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, product_id):
        serializer = ReviewSerializer(data=request.data, context={'product_id': product_id})
        if serializer.is_valid():
            
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReportListCreateView(APIView):
    """
    Handles listing all reports and creating a new report.
    """
    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAdminUser()]  # Only admin users can access GET
        return [IsAuthenticated()]  # Authenticated users can access POST

    def get(self, request):
        # List all reports
        reports = Report.objects.all()
        serializer = ReportSerializer(reports, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # Create a new report
        serializer = ReportSerializer(data=request.data)
        if serializer.is_valid():
            report = serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CommentReplyCreateView(APIView):
    """
    Handles creating a reply to a comment on a review.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, comment_id):
        serializer = ReviewReplySerializer(data=request.data, context={'comment_id': comment_id})
        if serializer.is_valid():
            serializer.save(user=request.user) 
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)