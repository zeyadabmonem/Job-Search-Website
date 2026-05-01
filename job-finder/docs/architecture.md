# JobFinder Architecture

## Layers

- Presentation: Vanilla JavaScript pages and reusable UI components
- API: Django REST Framework with app-based boundaries
- Domain apps: `users`, `jobs`, `applications`
- Persistence: relational database with integrity constraints

## Core Principles

- Keep page scripts thin and delegate data logic to modules
- Keep DRF views focused on transport concerns
- Put business rules in service-level functions
- Enforce role boundaries at permission layer
