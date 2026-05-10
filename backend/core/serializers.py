from rest_framework import serializers
from .models import Job, Application

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'

class MyApplicationSerializer(serializers.Serializer):
    job_title = serializers.CharField()
    company = serializers.CharField()
    application_status = serializers.CharField()
    applied_at = serializers.DateTimeField()

class DashboardApplicationSerializer(serializers.Serializer):
    job_title = serializers.CharField()
    applicant_name = serializers.CharField()
    status = serializers.CharField()

class DashboardStatsSerializer(serializers.Serializer):
    total_active_jobs = serializers.IntegerField()
    total_applications = serializers.IntegerField()
    latest_applications = DashboardApplicationSerializer(many=True)

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
