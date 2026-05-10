from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Job, Application

User = get_user_model()

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'

class MyApplicationSerializer(serializers.Serializer):
    job_id = serializers.IntegerField()
    job_title = serializers.CharField()
    company = serializers.CharField()
    application_status = serializers.CharField()
    applied_at = serializers.DateTimeField()

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

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    name = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('email', 'password', 'role', 'name', 'company')

    def create(self, validated_data):
        email = validated_data['email']
        name = validated_data.get('name', '')
        username = email.split('@')[0]
        
        # ensure unique username
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        user = User.objects.create_user(
            username=username,
            email=email,
            password=validated_data['password'],
            role=validated_data.get('role', 'seeker'),
            first_name=name,
            company=validated_data.get('company', '')
        )
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'first_name', 'last_name', 'company')
        read_only_fields = ('id', 'role', 'email', 'username')

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['email'] = user.email
        token['username'] = user.username
        token['company'] = user.company
        return token
