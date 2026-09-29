from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from apps.samples.models import StreetFoodOilSample
from apps.patients.serializers import StreetFoodOilSampleSerializer

class StreetFoodOilSampleViewSet(viewsets.ModelViewSet):
    queryset = StreetFoodOilSample.objects.all()
    serializer_class = StreetFoodOilSampleSerializer
    permission_classes = [permissions.IsAuthenticated]
    search_fields = ['sample_tag_code', 'vendor_location', 'food_item_type']