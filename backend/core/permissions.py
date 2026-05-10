from rest_framework import permissions

class IsAdminRole(permissions.BasePermission):
    """
    Allows access only to users with the 'admin' role.
    Admins (Employers) are allowed to post jobs and manage them.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')

class IsSeekerRole(permissions.BasePermission):
    """
    Allows access only to users with the 'seeker' role.
    Seekers are allowed to apply for jobs.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'seeker')
