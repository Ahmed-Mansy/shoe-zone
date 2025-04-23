from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.contrib.auth.models import User
from orders.models import Order  
from products.models import Product

class AdminDashboardView(APIView):
    #permission_classes = [IsAdminUser]

    def get(self, request):
        total_users = User.objects.count()
        total_orders = Order.objects.count()
        total_sales = sum(order.total_price for order in Order.objects.all())

        data = {
            'total_users': total_users,
            'total_orders': total_orders,
            'total_sales': total_sales,
        }
        return Response(data)
