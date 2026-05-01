# Coding Standards

## Naming

- HTML/CSS files: `kebab-case`
- Python modules: `snake_case`
- JavaScript functions and variables: `camelCase`
- Classes in JS/Python: `PascalCase`

## Organization

- Keep frontend page scripts in `assets/js/pages`
- Keep domain logic in `assets/js/modules`
- Keep backend business logic inside app-level services
- Keep API route groups isolated per app

## Git Workflow

- Branch naming: `feature/<scope>`, `fix/<scope>`, `chore/<scope>`
- Open pull requests against `main`
- Require review and passing checks before merge
