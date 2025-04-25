from django_filters import rest_framework as filters
from .models import Product

class ProductFilter(filters.FilterSet):
    size = filters.CharFilter(method='filter_by_size')
    color = filters.CharFilter(method='filter_by_color')
    material = filters.CharFilter(field_name='material', lookup_expr='icontains')
    
    class Meta:
        model = Product
        fields = []
    
    def filter_by_size(self, queryset, name, value):
        sizes = [s.strip().upper() for s in value.split(',')]
        return queryset.filter(sizes__contains=value)  # Basic implementation
        
    def filter_by_color(self, queryset, name, value):
        colors = [c.strip().lower() for c in value.split(',')]
        # More advanced implementation:
        return queryset.filter(
            reduce(
                operator.or_,
                (Q(colors__icontains=color) for color in colors)
            )
        )

# Add at top of file:
from functools import reduce
import operator
from django.db.models import Q