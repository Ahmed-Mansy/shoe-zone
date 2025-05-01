from django.core.management.base import BaseCommand
from products.models import Category

class Command(BaseCommand):
    help = 'Seed the database with initial categories and subcategories'

    def handle(self, *args, **kwargs):
        # Parent categories
        men, _ = Category.objects.get_or_create(name="Men", parent=None)
        women, _ = Category.objects.get_or_create(name="Women", parent=None)

        # Subcategories for Men
        Category.objects.get_or_create(name="Sneakers", parent=men)
        Category.objects.get_or_create(name="Running Shoes", parent=men)
        Category.objects.get_or_create(name="Boots", parent=men)

        # Subcategories for Women
        Category.objects.get_or_create(name="Flats", parent=women)
        Category.objects.get_or_create(name="Sandals", parent=women)
        Category.objects.get_or_create(name="Heels", parent=women)

        self.stdout.write(self.style.SUCCESS('✅ Categories and subcategories seeded successfully!'))
