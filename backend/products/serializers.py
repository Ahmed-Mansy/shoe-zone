from rest_framework import serializers
from .models import Rating
from products.models import Product

class RatingSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Rating
        fields = ['id', 'user', 'project', 'score']
        read_only_fields = ['id', 'user', 'project']

    def validate_score(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("The rating score must be between 1 and 5.")
        return value

    def create(self, validated_data):
        project = self.context.get('project')
        validated_data['project'] = project
        return super().create(validated_data)

    def validate(self, data):
        user = self.context['request'].user
        project = self.context.get('project')
        if Rating.objects.filter(user=user, project=project).exists():
            raise serializers.ValidationError("You have already rated this project.")
        return data
