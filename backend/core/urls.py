from django.urls import path
from .views import JobListCreateAPIView, JobRetrieveUpdateDestroyAPIView

urlpatterns = [
    path('jobs/', JobListCreateAPIView.as_view(), name='job-list-create'),
    path('jobs/<int:pk>/', JobRetrieveUpdateDestroyAPIView.as_view(), name='job-detail'),
]
