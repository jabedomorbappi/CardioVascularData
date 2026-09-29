from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions, filters
from apps.patients.models import Patient
from apps.patients.serializers import PatientSerializer

from rest_framework import viewsets, permissions, filters
from apps.patients.models import Patient
from apps.patients.serializers import PatientSerializer

class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['patient_code', 'occupation', 'residence_area', 'diagnosis_type']
    ordering_fields = ['created_at', 'age']

    def get_queryset(self):
        user = self.request.user
        queryset = Patient.objects.all().prefetch_related('reports', 'oil_samples')

        # Admin / Research Lead can see ALL records
        if user.is_staff or user.is_superuser:
            collector_id = self.request.query_params.get('collector_id')
            if collector_id:
                queryset = queryset.filter(collected_by_id=collector_id)
            return queryset

        # Regular Field Collectors only see THEIR OWN collected data
        return queryset.filter(collected_by=user)

    def perform_create(self, serializer):
        serializer.save(collected_by=self.request.user)