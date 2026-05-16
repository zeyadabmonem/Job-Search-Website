from rest_framework import generics, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Job
from .serializers import JobSerializer, DashboardStatsSerializer
from core.permissions import IsAdminRole

# We will import Application later in the method to avoid circular imports if necessary, 
# or just import it here if applications/models.py doesn't import jobs/views.py.
# from applications.models import Application 

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

class AdminDashboardAPIView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        from applications.models import Application # Local import to avoid circularity
        
        total_jobs = Job.objects.count()
        total_active_jobs = Job.objects.filter(status='Open').count()
        total_applications = Application.objects.count()
        latest_apps = Application.objects.select_related('job', 'seeker').order_by('-applied_at')[:5]

        latest_applications_data = [
            {
                "id": app.id,
                "job_title": app.job.title,
                "applicant_name": app.seeker.username,
                "status": app.status
            }
            for app in latest_apps
        ]

        data = {
            "total_jobs": total_jobs,
            "total_active_jobs": total_active_jobs,
            "total_applications": total_applications,
            "latest_applications": latest_applications_data
        }
        serializer = DashboardStatsSerializer(data)
        return Response(serializer.data)
