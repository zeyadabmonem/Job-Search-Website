# Implementation Plan - Project Restructuring

The goal is to organize the project files into a professional directory structure while maintaining all current functionality.

## Proposed Structure

```text
/
├── assets/
│   ├── css/             # All stylesheets
│   ├── js/              # All JavaScript logic
│   └── images/          # All image assets
├── index.html           # Renamed from home.html (entry point)
├── admin-dashboard.html
├── applied-jobs.html
├── create-job.html
├── job-details.html
├── jobs.html
├── login.html
├── my-jobs.html
├── nav.html
├── profile.html
├── register.html
├── search-results.html
└── search.html
```

## Steps

1. **Setup Folders**:
   - Create `assets/css` and `assets/js` directories.
   - Move existing `images` folder to `assets/images`.

2. **Move Assets**:
   - Move all `.css` files to `assets/css/`.
   - Move all `.js` files to `assets/js/`.
   - Move all `.html` files to the root directory.
   - Rename `home.html` to `index.html`.

3. **Update Links**:
   - In every `.html` file:
     - Update `<link rel="stylesheet" href="...">` to `href="assets/css/..."`.
     - Update `<script src="...">` to `src="assets/js/..."`.
     - Update `href="home.html"` to `href="index.html"`.
     - Update any `<img> src="..."` to `src="assets/images/..."`.
     - Update `<iframe> src="nav.html"` (if it's in the same directory, it stays same, but if I move html files, I must be careful).
   - In `assets/js/nav.js` and other `.js` files:
     - Update references to `home.html` to `index.html`.
     - Update image paths if they were relative.

4. **Cleanup**:
   - Remove the old `JobSearch-Website` and `JobSearch-phase02` folders once everything is verified.

## Verification
- Open `index.html` and ensure the navigation, styling, and logic work as expected.
- Verify application flows (Login -> Search -> Apply).
