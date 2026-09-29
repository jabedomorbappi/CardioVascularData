from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.samples.views import StreetFoodOilSampleViewSet

router = DefaultRouter()
router.register(r'', StreetFoodOilSampleViewSet, basename='oil-sample')

urlpatterns = [
    path('', include(router.urls)),
]