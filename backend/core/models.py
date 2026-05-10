from django.db import models
from django.contrib.auth.models import User

class Job(models.Model):
    STATUS_CHOICES = (
        ('Open', 'Open'),
        ('Closed', 'Closed'),
    )

    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    years = models.IntegerField(default=0)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} at {self.company}"

class Application(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Reviewed', 'Reviewed'),
        ('Interview', 'Interview'),
        ('Accepted', 'Accepted'),
        ('Rejected', 'Rejected'),
    )

    seeker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('seeker', 'job')

    def __str__(self):
        return f"{self.seeker.username} applied for {self.job.title}"
