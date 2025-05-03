from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum
from users.models import User  
from orders.models import Order
from rest_framework.permissions import IsAdminUser
from .serializers import OrderSerializer , UserOrderSerializer
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated


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

##
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]

class UserOrderHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        orders = Order.objects.filter(user=user).order_by('-created_at')
        serializer = UserOrderSerializer(orders, many=True)
        return Response(serializer.data)
