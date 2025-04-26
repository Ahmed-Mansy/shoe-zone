from django.db import models
from users.models import User

class Category(models.Model):
    id = models.AutoField(primary_key=True)  
    name = models.CharField(max_length=255, unique=True)
    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    image = models.ImageField(upload_to='product_images/', null=True, blank=True)
    average_rating = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    sizes = models.CharField(max_length=100, blank=True)  
    colors = models.CharField(max_length=100, blank=True)  
    material = models.CharField(max_length=100, blank=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['material']),
            models.Index(fields=['colors']),
        ]

    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='product_images/')