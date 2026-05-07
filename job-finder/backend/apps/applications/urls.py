from django.http import JsonResponse
from django.urls import path


def health(_request):
    return JsonResponse({"service": "applications", "status": "ok"})


urlpatterns = [path("health/", health)]
