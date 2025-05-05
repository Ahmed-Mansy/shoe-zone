from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum
from users.models import User
from orders.models import Order, OrderItem
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .serializers import OrderSerializer, OrderSerializer2
from rest_framework import status
from rest_framework import viewsets
import logging
from rest_framework.decorators import api_view, permission_classes
import stripe
from django.conf import settings
from datetime import timedelta
from django.utils import timezone
import uuid
from cart.models import Cart, CartItem

# Define the logger
logger = logging.getLogger(__name__)

# Stripe setup
stripe.api_key = settings.STRIPE_SECRET_KEY

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
    serializer_class = OrderSerializer2
    permission_classes = [IsAdminUser]


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createOrder(request):
    serializer = OrderSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        # Check for duplicate order
        existing_order = Order.objects.filter(
            user=request.user,
            shipping_address=serializer.validated_data['shipping_address'],
            created_at__gte=timezone.now() - timedelta(minutes=5),
            status='pending'
        ).first()
        if existing_order:
            logger.warning(f"Duplicate order detected for user {request.user.email}")
            return Response(
                {"error": "An identical order was recently created. Please check your order history."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create the order
        order = serializer.save()
        order.calculate_total()

        # Validate total price
        if order.total_price <= 0:
            logger.error(f"Invalid total_price for Order {order.id}: {order.total_price}")
            return Response(
                {"error": "Order total must be greater than zero."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Clear the user's cart
        try:
            cart = Cart.objects.get(user=request.user)
            cart.items.all().delete()
            logger.info(f"Cart cleared for user {request.user.email} after order {order.id}")
        except Cart.DoesNotExist:
            logger.warning(f"No cart found for user {request.user.email}")

        payment_status = serializer.validated_data.get('payment_status', 'cod')
        response_data = {"order": OrderSerializer(order).data}

        if payment_status == 'cod':
            logger.info(f"Order {order.id} created with Cash on Delivery for user {request.user.email}")
            response_data["message"] = "Order created with Cash on Delivery."
            return Response(response_data, status=status.HTTP_201_CREATED)

        # Stripe payment
        if payment_status == 'stripe':
            try:
                # Generate idempotency key to prevent duplicate payments
                idempotency_key = str(uuid.uuid4())
                payment_intent = stripe.PaymentIntent.create(
                    amount=int(order.total_price * 100),  # Convert to cents
                    currency='egp',
                    payment_method_types=['card'],
                    metadata={'user_id': request.user.id, 'order_id': order.id},
                    idempotency_key=idempotency_key
                )
                response_data.update({
                    "client_secret": payment_intent.client_secret,
                    "payment_intent_id": payment_intent.id
                })
                logger.info(f"Order {order.id} created with Stripe Payment Intent {payment_intent.id}")
            except stripe.error.CardError as e:
                logger.error(f"Stripe card error for user {request.user.email}: {str(e)}")
                return Response(
                    {"error": f"Card error: {e.user_message}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except stripe.error.StripeError as e:
                logger.error(f"Stripe error for user {request.user.email}: {str(e)}")
                return Response(
                    {"error": f"Payment processing failed: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                logger.error(f"Unexpected error for user {request.user.email}: {str(e)}")
                return Response(
                    {"error": "An unexpected error occurred. Please try again."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        return Response(response_data, status=status.HTTP_201_CREATED)

    logger.error(f"Failed to create order for user {request.user.email}: {serializer.errors}")
    return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirmPayment(request):
    payment_intent_id = request.data.get('payment_intent_id')
    order_id = request.data.get('order_id')

    if not payment_intent_id or not order_id:
        logger.warning(f"Missing payment_intent_id or order_id for user {request.user.email}")
        return Response(
            {"error": "Payment Intent ID and Order ID are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        order = Order.objects.get(id=order_id, user=request.user)
        if order.payment_status == 'cod':
            logger.warning(f"Cannot confirm payment for COD Order {order_id}")
            return Response(
                {"error": "Cannot confirm payment for Cash on Delivery orders."},
                status=status.HTTP_400_BAD_REQUEST
            )

        payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        if payment_intent.status == 'succeeded':
            order.is_paid = True
            order.status = 'shipped'
            order.save()
            logger.info(f"Stripe payment confirmed for Order {order.id} by user {request.user.email}")
            return Response({"message": "Payment confirmed successfully."})
        else:
            logger.warning(f"Stripe payment failed for Order {order_id}: {payment_intent.status}")
            return Response(
                {"error": f"Payment failed: {payment_intent.status}. Please try again."},
                status=status.HTTP_400_BAD_REQUEST
            )

    except stripe.error.StripeError as e:
        logger.error(f"Stripe error during payment confirmation: {str(e)}")
        return Response(
            {"error": f"Payment confirmation failed: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Order.DoesNotExist:
        logger.warning(f"Order {order_id} not found for user {request.user.email}")
        return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Unexpected error during payment confirmation: {str(e)}")
        return Response(
            {"error": "An unexpected error occurred. Please try again."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class UserOrderHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        orders = Order.objects.filter(user=user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)