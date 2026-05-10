# BUG-03 Verification Plan

## Goals
- Verify Apply button is hidden for Admin users.
- Verify Apply button is visible for Seekers.
- Verify Apply button is visible for Guests.

## Test Matrix
| Role | Expected Visibility | Actual Result | Screenshot |
|------|---------------------|---------------|------------|
| Admin | Hidden | TBD | TBD |
| Seeker | Visible | TBD | TBD |
## Observations
- `open_browser_url` blocks `file://` protocol.
- `Control+L` and typing into address bar results in relative URLs on the existing host.
- `Control+O` (Open File) opens a system dialog that is inaccessible.
- `window.location.href` in console is also blocked or redirected.
- Backend at `http://127.0.0.1:8000` is active but doesn't serve frontend files from the root.

## Plan Update
- Attempt to access frontend via `http://127.0.0.1:8000/static/...`.
- Try to find if there's any other way to render the local HTML.
- If all fails, report the environmental restriction to the user.

## Steps
1. Navigate to job-details.html?id=1.
2. Test A: Admin
   - Set sessionStorage (token, user role=admin).
   - Reload.
   - Capture screenshot.
   - Check .apply-section display.
3. Test B: Seeker
   - Update sessionStorage (user role=seeker).
   - Reload.
   - Capture screenshot.
4. Test C: Guest
   - Clear sessionStorage.
   - Reload.
   - Capture screenshot.
