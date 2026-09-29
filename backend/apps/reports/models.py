from django.db import models

# Create your models here.
import os
import uuid
from django.db import models
from django.conf import settings
from apps.patients.models import Patient

def patient_report_upload_path(instance, filename):
    """
    Saves uploaded scans inside structured folders per patient and report type:
    media/patient_reports/{patient_uuid}/{report_type}/{filename}
    """
    ext = filename.split('.')[-1]
    new_filename = f"{uuid.uuid4().hex[:8]}_{instance.report_type}.{ext}"
    return os.path.join(
        "patient_reports",
        str(instance.patient.id),
        instance.report_type.lower(),
        new_filename
    )

class PatientReport(models.Model):
    REPORT_TYPES = [
        ('ECG', 'Electrocardiogram'),
        ('ECHO', 'Echocardiogram'),
        ('EEG', 'Electroencephalogram'),
        ('LIPID', 'Lipid Profile Lab'),
        ('BLOOD', 'Other Blood Test Report'),
        ('OTHER', 'General Medical Document'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='reports')
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    title = models.CharField(max_length=255, blank=True, help_text="e.g. Admission ECG, 24h Echo")
    
    # File field handles image files (JPG, PNG) or PDFs
    file = models.FileField(upload_to=patient_report_upload_path)
    
    notes = models.TextField(blank=True, null=True, help_text="Notes taken by intern doctor")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.patient.patient_code} - {self.report_type} ({self.uploaded_at.strftime('%Y-%m-%d')})"