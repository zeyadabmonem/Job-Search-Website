# JobFinder

JobFinder is a job search platform split into two clear parts:

- `frontend`: HTML, CSS, and vanilla JavaScript
- `backend`: Django + Django REST Framework

The project is organized for team development, with modular frontend code, app-based backend structure, and docs for architecture and standards.

## Current Status

- Phase 1 complete: project infrastructure and architecture
- Phase 2 complete: full static frontend with modular JavaScript
- Phase 3 in progress: Django API implementation

## Repository Layout

```text
Job-Search-Website/
└── job-finder/
    ├── frontend/
    │   ├── index.html
    │   ├── assets/
    │   │   ├── css/
    │   │   └── js/
    │   └── pages/
    ├── backend/
    │   ├── config/
    │   ├── apps/
    │   └── requirements/
    ├── docs/
    ├── .env.example
    └── README.md
```

## Frontend Highlights

- Role-aware navbar (guest, user, admin)
- Pages: home, jobs, job details, login, register, dashboard
- Reusable modules for auth, jobs, applications, modal
- Clean CSS layers: base, layouts, components, pages, themes
- UX states: loading, empty states, inline feedback, validation

## Running the Frontend (Static)

No build tool is required.

1. Open `job-finder/frontend/pages/home.html` directly in a browser, or
2. Serve the folder with any static server.

Example with Python:

```bash
cd job-finder/frontend
python -m http.server 5500
```

Then open [http://localhost:5500/pages/home.html](http://localhost:5500/pages/home.html).

## Backend Setup (Django)

```bash
cd job-finder/backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements/dev.txt
python manage.py runserver
```

## Development Notes

- Keep frontend logic in `assets/js/modules` and `assets/js/pages`
- Keep backend domain logic isolated per app: `users`, `jobs`, `applications`
- Update `docs/` when changing architecture or API behavior

## License

MIT
