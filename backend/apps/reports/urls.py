from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.reports.views import PatientReportViewSet

router = DefaultRouter()
router.register(r'', PatientReportViewSet, basename='patient-report')

urlpatterns = [
    path('', include(router.urls)),
]