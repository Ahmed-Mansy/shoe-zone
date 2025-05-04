from django.db import models
from django.conf import settings  # Import settings to use AUTH_USER_MODEL
from products.models import Product 

ORDER_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('shipped', 'Shipped'),
    ('delivered', 'Delivered'),
]

class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    shipping_address = models.TextField(max_length=255, default='')
    is_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    payment_status = models.CharField(max_length=20, choices=[('cod', 'Cash on Delivery'), ('online', 'Online Payment')], default='cod')
    # items = models.ManyToManyField(Product, through='OrderItem', related_name='orders')

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
    
    # Override the save method to update the order total when an item is added or updated
    def save(self, *args, **kwargs):
        # Set the price to the product price if not provided
        # This ensures that if the product price changes, the order item price is updated accordingly
        if not self.price:
            self.price = self.product.price
        super().save(*args, **kwargs)
        self.order.calculate_total()

    # Override the delete method to update the order total when an item is deleted
    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        self.order.calculate_total()

