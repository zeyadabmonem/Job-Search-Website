# Database Rules

- One user can have many applications
- One job can have many applications
- Application must be unique by `(user_id, job_id)` to prevent duplicates
- Jobs are created and managed by admin accounts
