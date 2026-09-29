from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions, parsers
from apps.reports.models import PatientReport
from apps.patients.serializers import PatientReportSerializer

class PatientReportViewSet(viewsets.ModelViewSet):
    queryset = PatientReport.objects.all()
    serializer_class = PatientReportSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)