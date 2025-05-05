from django.db import models
from django.conf import settings
from products.models import Product

ORDER_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('shipped', 'Shipped'),
    ('delivered', 'Delivered'),
]

PAYMENT_STATUS_CHOICES = [
    ('cod', 'Cash on Delivery'),
    ('stripe', 'Stripe'),
]

class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    shipping_address = models.TextField(max_length=255, default='')
    is_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='cod')

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"

    def calculate_total(self):
        total = sum([item.price * item.quantity for item in self.items.all()])
        self.total_price = total
        self.save()

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

    def save(self, *args, **kwargs):
        if not self.price:
            self.price = self.product.price
        if self.product.stock_quantity < self.quantity:
            raise ValueError(f"Not enough stock for {self.product.name}. Available: {self.product.stock_quantity}")
        self.product.stock_quantity -= self.quantity
        self.product.save()
        super().save(*args, **kwargs)
        self.order.calculate_total()

    def delete(self, *args, **kwargs):
        self.product.stock_quantity += self.quantity
        self.product.save()
        super().delete(*args, **kwargs)
        self.order.calculate_total()