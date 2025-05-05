from django.db import models
from users.models import User
from products.models import Product

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField()
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'product']
        ordering = ['-created_at']

    def __str__(self):
        return f"Review by {self.user} on {self.product}"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.product.update_avg_rating()


class ReviewReply(models.Model):
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='replies')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reply by {self.user} on Review {self.review.id}"

class Report(models.Model):
    REPORT_CHOICES = [
        ('product', 'Product'),
        ('review', 'Review'),
        ('review_reply', 'ReviewReply')
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    report_type = models.CharField(max_length=15, choices=REPORT_CHOICES)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, blank=True, null=True)
    review = models.ForeignKey(Review, on_delete=models.CASCADE, blank=True, null=True)
    review_reply = models.ForeignKey(ReviewReply, on_delete=models.CASCADE, blank=True, null=True)
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report by {self.user} on {self.report_type}"
