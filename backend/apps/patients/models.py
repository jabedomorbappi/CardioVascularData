from django.db import models

# Create your models here.
import uuid
from django.db import models
from django.conf import settings

class Patient(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]

    DIAGNOSIS_CHOICES = [
        ('MI', 'Myocardial Infarction / Heart Attack'),
        ('STROKE', 'Ischemic / Hemorrhagic Stroke'),
        ('BOTH', 'Both Heart Attack & Stroke'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient_code = models.CharField(max_length=50, unique=True, help_text="Anonymized ID e.g. PAT-2026-001")
    collected_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Basic Demographics
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    occupation = models.CharField(max_length=150)
    residence_area = models.CharField(max_length=150, help_text="City, area or neighborhood")

    # Structured Clinical Vitals
    diagnosis_type = models.CharField(max_length=10, choices=DIAGNOSIS_CHOICES)
    blood_pressure_systolic = models.IntegerField(null=True, blank=True)
    blood_pressure_diastolic = models.IntegerField(null=True, blank=True)
    ejection_fraction_pct = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True, help_text="Echo EF %")

    # Flexible Behavioral & Lifestyle Metrics (Stored as JSON)
    # Example fields: sleep_bedtime, sleep_waketime, total_screen_hours, social_media_hours
    lifestyle_data = models.JSONField(default=dict, blank=True)

    # Flexible Dietary Metrics (Stored as JSON)
    # Example fields: junk_food_freq, street_food_locations, primary_oil_sources
    dietary_data = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.patient_code} - {self.get_diagnosis_type_display()} ({self.age}yo)"