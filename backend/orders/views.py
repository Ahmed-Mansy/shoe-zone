from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum
from users.models import User  
from orders.models import Order, OrderItem
from rest_framework.permissions import IsAdminUser ,IsAuthenticated
from .serializers import OrderSerializer ,Order2Serializer, OrderItemSerializer
from rest_framework import viewsets, status
import logging
from rest_framework.decorators import api_view, permission_classes
import stripe
from django.conf import settings
from datetime import timedelta
from django.utils import timezone


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
    serializer_class = Order2Serializer
    permission_classes = [IsAdminUser, IsAuthenticated]



# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def createOrder(request):
#     serializer = OrderSerializer(data=request.data, context={'request': request})
#     if serializer.is_valid():
#         order = serializer.save()
#         logger.info(f"Order {order.id} created successfully for user {request.user.email}")
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     logger.error(f"Failed to create order for user {request.user.email}: {serializer.errors}")
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Set up Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createOrder(request):
    serializer = OrderSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        # Check for duplicate order
        existing_order = Order.objects.filter(
            user=request.user,
            shipping_address=serializer.validated_data['shipping_address'],
            created_at__gte=timezone.now() - timedelta(minutes=5),  # Within last 5 minutes
            status='pending'
        ).first()
        if existing_order:
            logger.warning(f"Duplicate order detected for user {request.user.email}")
            return Response(
                {"details": "An identical order was recently created. Please check your order history."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create the order and order items
        order = serializer.save()

        # Calculate total price
        order.calculate_total()
        
        # Check if total_price is valid
        if order.total_price <= 0:
            logger.error(f"Invalid total_price for Order {order.id}: {order.total_price}")
            return Response(
                {"details": "Order total must be greater than zero."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check payment status
        if order.payment_status == 'cod':
            logger.info(f"Order {order.id} created with Cash on Delivery for user {request.user.email}")
            return Response({
                "order": OrderSerializer(order).data,
                "message": "Order created with Cash on Delivery.",
            }, status=status.HTTP_201_CREATED)

        # Create a Stripe Payment Intent for online payments
        try:
            payment_intent = stripe.PaymentIntent.create(
                amount=int(order.total_price * 100),
                currency='egp',
                payment_method_types=['card'],
                metadata={'user_id': request.user.id, 'order_id': order.id},
            )
        except stripe.error.StripeError as e:
            logger.error(f"Stripe error for user {request.user.email}: {str(e)}")
            return Response(
                {"details": f"Payment processing failed: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        logger.info(f"Order {order.id} created with Payment Intent {payment_intent.id} for user {request.user.email}")
        return Response({
            "order": OrderSerializer(order).data,
            "client_secret": payment_intent.client_secret,
        }, status=status.HTTP_201_CREATED)

    logger.error(f"Failed to create order for user {request.user.email}: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirmPayment(request):
    payment_intent_id = request.data.get('payment_intent_id')
    order_id = request.data.get('order_id')

    if not payment_intent_id or not order_id:
        logger.warning(f"Missing payment_intent_id or order_id in confirmPayment request by user {request.user.email}")
        return Response(
            {"details": "Payment Intent ID and Order ID are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        order = Order.objects.get(id=order_id, user=request.user)
        if order.payment_status == 'cod':
            logger.warning(f"Cannot confirm payment for COD Order {order_id} by user {request.user.email}")
            return Response(
                {"details": "Cannot confirm payment for Cash on Delivery orders."},
                status=status.HTTP_400_BAD_REQUEST
            )

        payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        if payment_intent.status == 'succeeded':
            order.is_paid = True
            order.status = 'Shipped'
            order.save()

            logger.info(f"Payment confirmed for Order {order.id} by user {request.user.email}")
            return Response({"details": "Payment confirmed successfully."})
        else:
            logger.warning(f"Payment failed for Order {order_id} by user {request.user.email}: {payment_intent.status}")
            return Response(
                {"details": "Payment failed. Please try again."},
                status=status.HTTP_400_BAD_REQUEST
            )
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error during payment confirmation for user {request.user.email}: {str(e)}")
        return Response(
            {"details": "Payment confirmation failed. Please try again."},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Order.DoesNotExist:
        logger.warning(f"Order {order_id} not found for user {request.user.email}")
        return Response({"details": "Order not found."}, status=status.HTTP_404_NOT_FOUND)


class UserOrderHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        orders = Order.objects.filter(user=user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)