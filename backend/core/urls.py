from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    JobListCreateAPIView, 
    JobRetrieveUpdateDestroyAPIView,
    MyApplicationsAPIView,
    AdminDashboardAPIView,
    ApplyAPIView,
    RegisterView, 
    UserProfileView, 
    CustomTokenObtainPairView
)

urlpatterns = [
    path('jobs/', JobListCreateAPIView.as_view(), name='job-list-create'),
    path('jobs/<int:pk>/', JobRetrieveUpdateDestroyAPIView.as_view(), name='job-detail'),
    path('my-applications/', MyApplicationsAPIView.as_view(), name='my-applications'),
    path('admin/dashboard/', AdminDashboardAPIView.as_view(), name='admin-dashboard'),
    path('apply/', ApplyAPIView.as_view(), name='apply'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', UserProfileView.as_view(), name='profile'),
]
