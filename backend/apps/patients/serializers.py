from rest_framework import serializers
from apps.patients.models import Patient
from apps.reports.models import PatientReport
from apps.samples.models import StreetFoodOilSample

class PatientReportSerializer(serializers.ModelSerializer):
    uploaded_by_username = serializers.ReadOnlyField(source='uploaded_by.username')

    class Meta:
        model = PatientReport
        fields = [
            'id', 'patient', 'report_type', 'title', 'file',
            'notes', 'uploaded_at', 'uploaded_by', 'uploaded_by_username'
        ]
        read_only_fields = ['id', 'uploaded_at', 'uploaded_by']

class StreetFoodOilSampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = StreetFoodOilSample
        fields = [
            'id', 'patient', 'sample_tag_code', 'vendor_name',
            'vendor_location', 'food_item_type', 'collected_at',
            'trans_fat_percentage', 'peroxide_value', 'lab_analysis_notes'
        ]
        read_only_fields = ['id', 'collected_at']

class PatientSerializer(serializers.ModelSerializer):
    reports = PatientReportSerializer(many=True, read_only=True)
    oil_samples = StreetFoodOilSampleSerializer(many=True, read_only=True)
    collected_by_username = serializers.ReadOnlyField(source='collected_by.username')

    class Meta:
        model = Patient
        fields = [
            'id', 'patient_code', 'collected_by', 'collected_by_username',
            'created_at', 'updated_at', 'age', 'gender', 'occupation',
            'residence_area', 'diagnosis_type', 'blood_pressure_systolic',
            'blood_pressure_diastolic', 'ejection_fraction_pct',
            'lifestyle_data', 'dietary_data', 'reports', 'oil_samples'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'collected_by']