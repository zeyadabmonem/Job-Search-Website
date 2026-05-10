# JobFinder Backend: Team Work Plan

This document outlines the specific responsibilities for all 6 team members during the Django backend implementation.

## Repository Structure
- **/frontend**: Static UI files (HTML, CSS, JS).
- **/backend**: Django project and API logic.

---

## Member Assignments & Detailed Tasks

### Pair 1: Authentication & User Management
**Members: [Member 1 - Team Lead] & [Member 2]** zeyad mazen
- **Objective**: Handle security, login, and user roles.
- **Tasks**:
  1. Initialize Django project and install dependencies (`djangorestframework`, `cors-headers`).
  2. Create a custom **User Model** extending `AbstractUser`.
  3. Implement **Registration & Login** APIs using JWT or Session-based auth.
  4. Design **Permissions**: Ensure only Admins can post jobs, while Seekers can apply.
  5. **Profile API**: Create an endpoint for users to view/edit their own profile details.

### Pair 2: Job Listing & Search Logic
**Members: [Member 3] & [Member 4]** jamal osos 
- **Objective**: Manage the job database and search functionality.
- **Tasks**:
-- jamal 
  1. Design the **Job Model** (fields: title, company, salary, description, status, etc.).  
  2. Implement **CRUD APIs**:
     - `GET /api/jobs/`: List all jobs.
     - `POST /api/jobs/`: Add new job (Admin only).
-- osama     
     - `PUT /api/jobs/<id>/`: Edit job details.
     - `DELETE /api/jobs/<id>/`: Remove a listing.
  3. **Search & Filter**: Add query parameters to filter jobs by title, company, or salary range.


### Pair 3: Applications & Admin Dashboard 
**Members: [Member 5] & [Member 6]** adham mo 
- **Objective**: Handle job applications and company statistics.
- **Tasks**:
-- adham 
  1. Design the **Application Model** (links a User to a Job).
  2. Implement the **Apply API**: `POST /api/apply/`.
-- mo   
  seeker-admin
  3. **My Applications**: Create an API for seekers to see where they've applied.
  4. **Admin Dashboard Stats**: Create an API that returns:
     - Total number of active jobs.
     - Total number of applications received.
     - Recent application list for the admin.

---

## Professional Workflow
- **Branching**: All work must happen on branches named `feature/member-name-task`.
- **Commits**: Use clear messages like `feat: added job model` or `fix: login validation`.
- **Reviews**: Once a task is done, open a Pull Request (PR) for the Team Lead to review.


## Quick Start (Backend)
```powershell

cd backend
.\venv\Scripts\activate
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```
