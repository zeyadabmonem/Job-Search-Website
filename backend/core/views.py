from rest_framework import generics, filters, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Job, Application
from .permissions import IsAdminRole, IsSeekerRole
from .serializers import (
    JobSerializer, MyApplicationSerializer, DashboardStatsSerializer, 
    ApplySerializer, ApplicationSerializer, UserRegistrationSerializer, 
    UserProfileSerializer, CustomTokenObtainPairSerializer
)

User = get_user_model()

class JobListCreateAPIView(generics.ListCreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminRole()]
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = {'years': ['gte', 'lte', 'exact'], 'status': ['exact']}
    search_fields = ['title', 'company']

class JobRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminRole()]


class MyApplicationsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        applications = Application.objects.filter(seeker=request.user).select_related('job')
        data = [
            {
                "job_title": app.job.title,
                "company": app.job.company,
                "application_status": app.status,
                "applied_at": app.applied_at
            }
            for app in applications
        ]
        serializer = MyApplicationSerializer(data, many=True)
        return Response(serializer.data)

class AdminDashboardAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_active_jobs = Job.objects.filter(status='Open').count()
        total_applications = Application.objects.count()
        latest_apps = Application.objects.select_related('job', 'seeker').order_by('-applied_at')[:5]

        latest_applications_data = [
            {
                "job_title": app.job.title,
                "applicant_name": app.seeker.username,
                "status": app.status
            }
            for app in latest_apps
        ]

        data = {
            "total_active_jobs": total_active_jobs,
            "total_applications": total_applications,
            "latest_applications": latest_applications_data
        }
        serializer = DashboardStatsSerializer(data)
        return Response(serializer.data)

class ApplyAPIView(APIView):
    permission_classes = [IsSeekerRole]

    def post(self, request):
        serializer = ApplySerializer(data=request.data)
        if serializer.is_valid():
            job = serializer.validated_data['job']
            if Application.objects.filter(seeker=request.user, job=job).exists():
                return Response(
                    {"detail": "You have already applied for this job."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            application = Application.objects.create(seeker=request.user, job=job)
            return Response(ApplicationSerializer(application).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegistrationSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
