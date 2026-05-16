from rest_framework import serializers
from .models import Application

class MyApplicationSerializer(serializers.Serializer):
    job_id = serializers.IntegerField()
    job_title = serializers.CharField()
    company = serializers.CharField()
    application_status = serializers.CharField()
    applied_at = serializers.DateTimeField()

class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    company = serializers.CharField(source='job.company', read_only=True)
    applicant_name = serializers.CharField(source='seeker.username', read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'job', 'job_title', 'company', 'seeker', 'applicant_name', 'status', 'applied_at']
        read_only_fields = ['seeker', 'status', 'applied_at']

class ApplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['job']
