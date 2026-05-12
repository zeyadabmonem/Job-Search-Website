# 🐛 Bug Report — JobFinder Full-Stack Project
**Date:** 2026-05-10 | **Scope:** Backend (Django/DRF) + Frontend (HTML/JS)

---

## Executive Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical | 5 |
| 🟠 Major | 7 |
| 🟡 Minor | 5 |
| **Total** | **17** |

---

## 🔴 CRITICAL BUGS

---

### BUG-01 — Admin Dashboard Protected by Wrong Permission Class

**Description:**  
`AdminDashboardAPIView` uses `IsAdminUser` (Django's built-in `is_staff` flag) instead of the custom `IsAdminRole` permission. This means a normal admin-role user who does NOT have `is_staff=True` in the database will get a **403 Forbidden** when visiting the dashboard, breaking the entire admin flow.

**Cause:**  
`permission_classes = [IsAdminUser]` checks `user.is_staff`, not `user.role == 'admin'`. The project uses a custom role system, not Django's staff system.

**Affected Files:**
- `backend/core/views.py` — line 61

**Severity:** 🔴 Critical

**Suggested Fix:**
```python
# Change:
permission_classes = [IsAdminUser]
# To:
permission_classes = [IsAdminRole]
```

---

### BUG-02 — Role Mismatch: Frontend Sends `"user"`, Backend Expects `"seeker"`

**Description:**  
The registration form HTML sets `data-role="user"` for the Job Seeker button, and the hidden input defaults to `value="user"`. The backend `User` model only accepts `'seeker'` or `'admin'` as valid role choices. This means every Job Seeker registration **fails validation** or creates a user with an invalid role, breaking all role-based features (apply, my-applications, etc.).

**Cause:**  
`register.html` line 32: `data-role="user"` and line 35: `value="user"`.  
`models.py` line 6: `('seeker', 'Job Seeker')` — the key is `seeker`, not `user`.

**Affected Files:**
- `frontend/register.html` — lines 32, 35
- `backend/core/models.py` — line 6 (reference)

**Severity:** 🔴 Critical

**Suggested Fix:**
```html
<!-- Change data-role="user" to data-role="seeker" -->
<button type="button" class="role-btn active" data-role="seeker">Job Seeker</button>
<!-- Change hidden input default value -->
<input type="hidden" id="role" value="seeker" />
```

---

### BUG-03 — `IsSeekerRole` Permission Blocks Admins from Applying, But Admins CAN Access the Apply Button

**Description:**  
When an `admin` user visits a job-details page, the Apply button is **visible and clickable**. Clicking it sends a POST to `/api/apply/` which is protected by `IsSeekerRole`, so the API correctly returns 403. However, the frontend shows a generic toast error instead of a meaningful message. More importantly, there is **no frontend guard** to hide the Apply button for admin users — exposing a broken UX flow.

**Cause:**  
`job-details.html` never checks `JobStorage.getUser().role` before rendering the Apply button. There is no frontend role-check on that page.

**Affected Files:**
- `frontend/job-details.html` — apply button render section (lines 80–91)

**Severity:** 🔴 Critical

**Suggested Fix:**  
After loading job data, check the user role and hide/disable the apply button for admins:
```javascript
var currentUser = JobStorage.getUser();
if (currentUser && currentUser.role === 'admin') {
  var applyBtn = document.getElementById('apply-btn');
  applyBtn.style.display = 'none';
}
```

---

### BUG-04 — `job-details.html` Apply Status Uses Local sessionStorage, Not the Real Database

**Description:**  
The line `if (JobStorage.hasApplied(job.id)) markApplied();` checks local `sessionStorage` (`jf_applied`), NOT the actual database. The `applyToJob()` in `storage.js` writes to sessionStorage, but the actual POST goes to the backend API. These two are **completely disconnected** — the local store is never synced from the API.

**Consequences:**
1. If a user applies, clears the browser session, then revisits job-details — the button shows "Apply Now" again, allowing a re-submission (which the backend correctly blocks with a 400, but the UX is confusing).
2. The `applyToJob()` function in `storage.js` (lines 82–90) is legacy dead code that is never called during the actual apply flow.

**Affected Files:**
- `frontend/job-details.html` — line 145
- `frontend/assets/js/storage.js` — lines 82–94 (dead code)

**Severity:** 🔴 Critical

**Suggested Fix:**  
Replace the local check with a real API check. After fetching the job, fetch `/api/my-applications/` and check if the current job ID appears in the results. Only call `markApplied()` if confirmed.

---

### BUG-05 — `dashboard.html` Has No Role/Auth Guard on the Frontend

**Description:**  
`dashboard.html` only checks for a token (`if (!token) redirect to login`), but does **not** verify that the token belongs to an `admin` role user. A logged-in `seeker` can navigate directly to `dashboard.html` and see the admin dashboard UI (the page will just show an API error because the backend blocks the API call, but the full dashboard shell renders).

**Cause:**  
`dashboard.html` script (line 135-139) only checks token existence, not the role stored in `JobStorage.getUser()`.

**Affected Files:**
- `frontend/dashboard.html` — lines 135–139

**Severity:** 🔴 Critical

**Suggested Fix:**
```javascript
var token = JobStorage.getToken();
var user  = JobStorage.getUser();
if (!token || !user || user.role !== 'admin') {
  window.top.location.href = 'login.html';
  return;
}
```

---

## 🟠 MAJOR BUGS

---

### BUG-06 — `job-manage.html` Has No Auth/Role Guard (Admin-only Page is Publicly Accessible)

**Description:**  
`job-manage.html` (the "My Jobs" admin page) fetches jobs via `GET /api/jobs/` (which is `AllowAny`) and renders a full management UI with delete buttons — with **no check** for whether the user is logged in or is an admin. A guest or seeker can open this page and see all jobs with delete buttons (deletes will fail at the API level, but the UI is fully exposed).

**Affected Files:**
- `frontend/job-manage.html` — no auth guard in its script

**Severity:** 🟠 Major

**Suggested Fix:**  
Add at the top of the script:
```javascript
var user = JobStorage.getUser();
if (!user || user.role !== 'admin') {
  window.top.location.href = 'login.html';
}
```

---

### BUG-07 — `job-create.html` Has No Role Guard (Frontend Only)

**Description:**  
`job-create.html` checks for a token before submitting the form, but does **not** verify the role. A seeker can navigate to this page, fill out the form, and see the full job creation UI. The backend correctly blocks the POST (403), but the seeker gets a confusing `alert('Failed to publish job.')` instead of being told they don't have permission.

**Affected Files:**
- `frontend/job-create.html` — lines 155–160

**Severity:** 🟠 Major

**Suggested Fix:**  
Add a role check before rendering the form:
```javascript
var user = JobStorage.getUser();
if (!user || user.role !== 'admin') {
  window.top.location.href = 'index.html';
}
```
Also improve the 403 error message from a generic `alert` to the specific permission denial message.

---

### BUG-08 — `applications.html` Page is Accessible to Admin Users

**Description:**  
`applications.html` redirects to login if no token, but does not check if the user is a seeker. An admin can visit this page. The API call to `/api/my-applications/` will succeed (it only checks `IsAuthenticated`) and return the admin's applications — but admins aren't supposed to apply to jobs. The view returns an empty list for admins (they have no applications), but shows no role-appropriate message.

**Affected Files:**
- `frontend/applications.html` — no role guard
- `backend/core/views.py` — `MyApplicationsAPIView` uses `IsAuthenticated` not `IsSeekerRole`

**Severity:** 🟠 Major

**Suggested Fix:**  
1. On the frontend, redirect admins away from this page.
2. On the backend, change `MyApplicationsAPIView` permission to `IsSeekerRole` for consistency.

---

### BUG-09 — `home.js` Reads Jobs from sessionStorage Instead of the API

**Description:**  
`home.js` (lines 2–3) reads `JobStorage.getAllJobs()` and `JobStorage.getAppliedJobs()` from local sessionStorage. Since jobs are now stored in the backend database (not sessionStorage), `stat-jobs` will always show `0` and the "Recent Listings" section will always be empty. The home page is completely broken for showing real data.

**Affected Files:**
- `frontend/assets/js/home.js` — lines 2–11

**Severity:** 🟠 Major

**Suggested Fix:**  
Replace the sessionStorage reads with a `fetch('http://127.0.0.1:8000/api/jobs/')` call to populate the stats and recent listings from the real API.

---

### BUG-10 — Status Case Mismatch: Frontend Sends Lowercase, DB Stores Title-Case

**Description:**  
In `job-create.html` (line 151), the status is capitalized before saving: `jobStatus.charAt(0).toUpperCase() + jobStatus.slice(1)`. This converts `'open'` → `'Open'` and `'closed'` → `'Closed'`. However, the select options in the same file (lines 70–71) use lowercase values: `value="open"` and `value="closed"`. The backend model uses Title-Case choices: `('Open', 'Open')` and `('Closed', 'Closed')`.

The capitalization in JS partially fixes this, **but** the `home.js` status badge (line 40) checks `job.status === "open"` (lowercase), which will **never match** since the DB returns `"Open"` (Title-case). The badge will always show as "Closed" regardless of real status.

**Affected Files:**
- `frontend/assets/js/home.js` — line 40
- `frontend/job-create.html` — lines 70–71

**Severity:** 🟠 Major

**Suggested Fix:**  
Standardize all status comparisons to be case-insensitive:
```javascript
// home.js line 40
(job.status && job.status.toLowerCase() === 'open' ? '● Open' : '● Closed')
```

---

### BUG-11 — `MyApplicationsAPIView` Does Not Check for `IsSeekerRole` 

**Description:**  
`MyApplicationsAPIView` uses `permission_classes = [IsAuthenticated]` instead of `[IsSeekerRole]`. This means an admin can call `/api/my-applications/` and get a response (empty since they have no applications). More importantly, there's a conceptual inconsistency: the apply endpoint is seeker-only, but the "view my applications" endpoint is not. They should use matching permission classes.

**Affected Files:**
- `backend/core/views.py` — line 44

**Severity:** 🟠 Major

**Suggested Fix:**
```python
permission_classes = [IsSeekerRole]
```

---

### BUG-12 — Dashboard Stats: `stat-total` and `stat-open` Both Show the Same Value

**Description:**  
In `dashboard.html` (lines 150–151), both `stat-total` (Total Jobs) and `stat-open` (Open Jobs) are set to `data.total_active_jobs`. Total jobs should include both open AND closed jobs, but the backend only returns the count of open jobs. The "Total Jobs" stat is therefore wrong.

**Cause:**  
`AdminDashboardAPIView` only computes `Job.objects.filter(status='Open').count()`. There's no separate total jobs count. The dashboard comment even says `// Using as same for now`.

**Affected Files:**
- `backend/core/views.py` — line 64
- `frontend/dashboard.html` — line 151

**Severity:** 🟠 Major

**Suggested Fix:**  
Add a `total_jobs` field to the backend view:
```python
total_jobs = Job.objects.count()
total_active_jobs = Job.objects.filter(status='Open').count()
```
Update `DashboardStatsSerializer` and the frontend to use the new field.

---

## 🟡 MINOR BUGS

---

### BUG-13 — `clearSelectedJob()` in `storage.js` Deletes from `memStorage` Instead of `sessionStorage`

**Description:**  
`clearSelectedJob()` (line 76) does `delete memStorage[KEYS.selected]` but the data was saved with `sessionStorage.setItem()`. The `memStorage` object is always empty and never used for storing. This function does nothing — it fails to clear the selected job from sessionStorage.

**Affected Files:**
- `frontend/assets/js/storage.js` — line 76

**Severity:** 🟡 Minor

**Suggested Fix:**
```javascript
function clearSelectedJob() { sessionStorage.removeItem(KEYS.selected); }
```

---

### BUG-14 — `job-manage.html` Uses `localhost:8000` While Other Pages Use `127.0.0.1:8000`

**Description:**  
`job-manage.html` line 73 fetches from `http://localhost:8000/api/jobs/`. All other frontend files use `http://127.0.0.1:8000`. This inconsistency can cause subtle CORS issues on some systems where `localhost` and `127.0.0.1` are treated as different origins.

**Affected Files:**
- `frontend/job-manage.html` — line 73
- `frontend/job-details.html` — line 115
- `frontend/search-results.html` — line 47

**Severity:** 🟡 Minor

**Suggested Fix:**  
Standardize all API base URLs to `http://127.0.0.1:8000` across all frontend files. Ideally, define a single `const API_BASE = 'http://127.0.0.1:8000'` in `storage.js`.

---

### BUG-15 — `profile.html` Displays `username` as the Name, Not `first_name`

**Description:**  
`profile.html` (lines 127–128, 135) shows `user.username` as the display name and full name. However, during registration, the user's actual name is stored in `first_name` (via `UserRegistrationSerializer` line 69: `first_name=name`). The profile page should show `user.first_name` for the "Full Name" field and fall back to `user.username`.

**Affected Files:**
- `frontend/profile.html` — lines 127–128, 135
- `backend/core/serializers.py` — `UserProfileSerializer` (includes `first_name`)

**Severity:** 🟡 Minor

**Suggested Fix:**
```javascript
var displayName = user.first_name || user.username || 'User';
document.getElementById('profile-name').textContent = displayName;
document.getElementById('info-name').textContent = displayName;
```

---

### BUG-16 — `settings.py` Has `CORS_ALLOW_ALL_ORIGINS = True` Declared Twice

**Description:**  
`settings.py` (lines 30 and 142) has `CORS_ALLOW_ALL_ORIGINS = True` declared twice. While this has no runtime effect, it's a code quality issue that indicates copy-paste error.

**Affected Files:**
- `backend/config/settings.py` — line 30 and 142

**Severity:** 🟡 Minor

**Suggested Fix:**  
Remove the duplicate on line 30, keeping only the one at the bottom with the other JWT settings.

---

### BUG-17 — Models Not Registered in Django Admin

**Description:**  
`admin.py` is empty — `User`, `Job`, and `Application` models are not registered. This means the Django admin panel at `/admin/` cannot be used to manage any data, which is a significant gap for development and debugging.

**Affected Files:**
- `backend/core/admin.py`

**Severity:** 🟡 Minor

**Suggested Fix:**
```python
from django.contrib import admin
from .models import User, Job, Application

admin.site.register(User)
admin.site.register(Job)
admin.site.register(Application)
```

---

## 📊 Bug Priority Matrix

| Priority | Bug ID | Area | Impact |
|----------|--------|------|--------|
| 1st | BUG-02 | Auth/Register | Role mismatch breaks ALL seeker functionality |
| 2nd | BUG-01 | Auth/Permissions | Admin dashboard always returns 403 |
| 3rd | BUG-05 | Frontend Security | Seekers can view admin dashboard shell |
| 4th | BUG-03 | UX/Business Logic | Admins see Apply button they can't use |
| 5th | BUG-04 | Data Integrity | Apply status uses stale local store |
| 6th | BUG-09 | Home Page | Home page stats and recent jobs always empty |
| 7th | BUG-06 | Frontend Security | job-manage.html has no auth guard |
| 8th | BUG-07 | Frontend Security | job-create.html has no role guard |
| 9th | BUG-10 | UI | Status badge always shows wrong value in home.js |
| 10th | BUG-12 | Dashboard | Total vs Open jobs stats both show same number |
| 11th | BUG-08 | Business Logic | Applications page accessible to admins |
| 12th | BUG-11 | Permissions | MyApplications not seeker-only at API level |
| 13th | BUG-13 | Dead Code | clearSelectedJob() does nothing |
| 14th | BUG-14 | Network | Inconsistent localhost vs 127.0.0.1 |
| 15th | BUG-15 | Profile | Name shows username not first_name |
| 16th | BUG-16 | Code Quality | Duplicate CORS setting |
| 17th | BUG-17 | Admin Panel | Models not registered |

---

## 🗂 Bug Categories Summary

### 🔐 Authentication & Permissions (Critical)
- BUG-01: Wrong Django permission class on admin dashboard
- BUG-02: `"user"` role vs `"seeker"` mismatch — registration broken

### 🛡 Frontend Route Guards (Critical/Major)
- BUG-05: No role check on dashboard.html
- BUG-06: No auth check on job-manage.html
- BUG-07: No role check on job-create.html

### 💼 Business Logic (Critical/Major)
- BUG-03: Apply button visible to admins
- BUG-04: Apply status based on local cache, not DB
- BUG-08: Applications page accessible to admins
- BUG-11: MyApplications endpoint not seeker-only

### 📊 Data & State (Major)
- BUG-09: Home page reads jobs from empty sessionStorage
- BUG-10: Status case mismatch (lowercase vs Title-Case)
- BUG-12: Dashboard shows same stat for Total and Open jobs

### 🧹 Code Quality & Minor Issues
- BUG-13: clearSelectedJob() deletes from wrong store
- BUG-14: Inconsistent API base URLs
- BUG-15: Profile shows username instead of first_name
- BUG-16: Duplicate CORS setting in settings.py
- BUG-17: Models not registered in Django admin
