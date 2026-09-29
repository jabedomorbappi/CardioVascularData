from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions, filters
from apps.patients.models import Patient
from apps.patients.serializers import PatientSerializer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all().prefetch_related('reports', 'oil_samples')
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['patient_code', 'occupation', 'residence_area', 'diagnosis_type']
    ordering_fields = ['created_at', 'age']

    def perform_create(self, serializer):
        serializer.save(collected_by=self.request.user)