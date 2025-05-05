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

    def get_permissions(self):
        if self.request.method == 'GET':
            return []  # يعني مفيش قيود، أي حد يقدر يعمل GET
        return [IsAuthenticated()]  # POST يحتاج يكون المستخدم مسجل دخول

    def get(self, request, product_id):
        product = Product.objects.get(id=product_id)
        reviews = Review.objects.filter(product=product)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, product_id):
        serializer = ReviewSerializer(data=request.data, context={'product_id': product_id,'user': request.user})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class ReviewDeleteView(APIView):
#     permission_classes = [IsAuthenticated]

#     def delete(self, request, review_id):
#         try:
#             review = Review.objects.get(id=review_id, user=request.user)
#         except Review.DoesNotExist:
#             return Response({"detail": "Review not found or not authorized."}, status=status.HTTP_404_NOT_FOUND)

#         review.delete()
#         return Response({"detail": "Review deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class ReviewDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id)
            # التحقق من أن المستخدم هو صاحب المراجعة أو أنه Admin
            if review.user != request.user and not request.user.is_staff:
                return Response({"detail": "You do not have permission to delete this review."}, status=status.HTTP_403_FORBIDDEN)
        except Review.DoesNotExist:
            return Response({"detail": "Review not found."}, status=status.HTTP_404_NOT_FOUND)

        review.delete()
        return Response({"detail": "Review deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    

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