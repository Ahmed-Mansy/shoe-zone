from django.core.management.base import BaseCommand
from faker import Faker
import random
from products.models import Product, Category

class Command(BaseCommand):
    help = 'Seed the database with fake products'

    def handle(self, *args, **kwargs):
        fake = Faker()

        # Get only subcategories (to avoid assigning products to parent categories like "Men" or "Women")
        subcategories = Category.objects.exclude(parent=None)

        if not subcategories.exists():
            self.stdout.write(self.style.WARNING('No subcategories found. Please create categories before seeding products.'))
            return

        for _ in range(50):
            Product.objects.create(
                name=fake.word().capitalize() + " Shoes",
                description=fake.sentence(nb_words=10),
                price=round(random.uniform(30.0, 200.0), 2),
                category=random.choice(subcategories)  # Assign random subcategory
            )

        self.stdout.write(self.style.SUCCESS('✅ Successfully seeded 50 products with categories!'))
