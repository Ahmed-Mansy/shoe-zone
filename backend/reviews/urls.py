from django.contrib import admin
from django.urls import path, include
from .views import *

urlpatterns = [
    path('products/<int:product_id>/reviews/', ReviewListCreateView.as_view(), name='review-list-create'),
    path('comments/<int:comment_id>/replies/', CommentReplyCreateView.as_view(), name='comment-reply-create'),
    path('reports/', ReportListCreateView.as_view(), name='report-list-create'),
]
