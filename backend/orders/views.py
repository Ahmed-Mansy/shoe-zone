from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum
from users.models import User  
from orders.models import Order
from rest_framework.permissions import IsAdminUser ,IsAuthenticated
from .serializers import OrderSerializer , OrderItemSerializer
from rest_framework import viewsets, status
import logging
from rest_framework.decorators import api_view, permission_classes

# Define the logger
logger = logging.getLogger(__name__)

class AdminDashboardView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_users = User.objects.filter(is_superuser=False).count()
        total_orders = Order.objects.count()
        total_sales = Order.objects.aggregate(total=Sum('total_price'))['total'] or 0

        data = {
            'total_users': total_users,
            'total_orders': total_orders,
            'total_sales': total_sales,
        }
        return Response(data)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createOrder(request):
    serializer = OrderSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        order = serializer.save()
        logger.info(f"Order {order.id} created successfully for user {request.user.email}")
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    logger.error(f"Failed to create order for user {request.user.email}: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserOrderHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        orders = Order.objects.filter(user=user).order_by('-created_at')
        serializer = OrderItemSerializer(orders, many=True)
        return Response(serializer.data)