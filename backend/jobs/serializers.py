from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'

class DashboardApplicationSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    job_title = serializers.CharField()
    applicant_name = serializers.CharField()
    status = serializers.CharField()

class DashboardStatsSerializer(serializers.Serializer):
    total_jobs = serializers.IntegerField()
    total_active_jobs = serializers.IntegerField()
    total_applications = serializers.IntegerField()
    latest_applications = DashboardApplicationSerializer(many=True)
