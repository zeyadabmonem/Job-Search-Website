from django.urls import path
from .views import MyApplicationsAPIView, ApplyAPIView, ApplicationStatusUpdateAPIView

urlpatterns = [
    path('my-applications/', MyApplicationsAPIView.as_view(), name='my-applications'),
    path('apply/', ApplyAPIView.as_view(), name='apply'),
    path('admin/application/<int:pk>/status/', ApplicationStatusUpdateAPIView.as_view(), name='update-application-status'),
]
