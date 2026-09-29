from django.db import models

# Create your models here.
import uuid
from django.db import models
from django.conf import settings
from apps.patients.models import Patient

class StreetFoodOilSample(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='oil_samples')
    sample_tag_code = models.CharField(max_length=50, unique=True, help_text="e.g. OIL-PAT001-A")
    
    vendor_name = models.CharField(max_length=200, blank=True)
    vendor_location = models.CharField(max_length=255, help_text="Street address or area of food stall")
    food_item_type = models.CharField(max_length=150, help_text="e.g. Fried Chicken, Singara, Puri")
    
    collected_at = models.DateField(auto_now_add=True)
    collected_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Lab Testing Results (Filled later after lab processing)
    trans_fat_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    peroxide_value = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    lab_analysis_notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.sample_tag_code} ({self.vendor_location})"