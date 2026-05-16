from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Application
from .serializers import MyApplicationSerializer, ApplySerializer, ApplicationSerializer
from core.permissions import IsAdminRole, IsSeekerRole

class MyApplicationsAPIView(APIView):
    permission_classes = [IsSeekerRole]

    def get(self, request):
        applications = Application.objects.filter(seeker=request.user).select_related('job')
        data = [
            {
                "job_id": app.job.id,
                "job_title": app.job.title,
                "company": app.job.company,
                "application_status": app.status,
                "applied_at": app.applied_at
            }
            for app in applications
        ]
        serializer = MyApplicationSerializer(data, many=True)
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

class ApplicationStatusUpdateAPIView(APIView):
    permission_classes = [IsAdminRole]

    def patch(self, request, pk):
        try:
            application = Application.objects.get(pk=pk)
        except Application.DoesNotExist:
            return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if new_status in dict(Application.STATUS_CHOICES):
            application.status = new_status
            application.save()
            return Response({"status": application.status})
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
