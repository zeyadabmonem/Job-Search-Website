from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Job, Application

class CustomUserAdmin(UserAdmin):
    model = User
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Profile Info', {'fields': ('role', 'company')}),
    )

admin.site.register(User, CustomUserAdmin)
admin.site.register(Job)
admin.site.register(Application)
