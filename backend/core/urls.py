from django.urls import path
from .views import (
    JobListCreateAPIView, 
    JobRetrieveUpdateDestroyAPIView,
    MyApplicationsAPIView,
    AdminDashboardAPIView,
    ApplyAPIView
)

urlpatterns = [
    path('jobs/', JobListCreateAPIView.as_view(), name='job-list-create'),
    path('jobs/<int:pk>/', JobRetrieveUpdateDestroyAPIView.as_view(), name='job-detail'),
    path('my-applications/', MyApplicationsAPIView.as_view(), name='my-applications'),
    path('admin/dashboard/', AdminDashboardAPIView.as_view(), name='admin-dashboard'),
    path('apply/', ApplyAPIView.as_view(), name='apply'),
]
