# 🚀 JobFinder: The Ultimate Career Connection Platform

![JobFinder Banner](frontend/assets/images/readme_banner.png)

JobFinder is a professional, high-performance full-stack job search ecosystem. It bridges the gap between top-tier talent and industry-leading companies with a focus on speed, elegant design, and seamless user experience.

---

## ✨ Key Features

### 🏢 For Employers (Admins)
- **Dynamic Dashboard**: Monitor company stats, total listings, and application volume in real-time.
- **Job Lifecycle Management**: Post, Edit, Toggle (Open/Closed), and Delete job listings with optimized workflows.
- **Applicant Tracking**: Review recent applications, manage status (Interview, Accepted, Rejected), and track seeker engagement.

### 🔍 For Job Seekers
- **Smart Search**: Filter jobs by title, company, and experience level with instant results.
- **Premium Job Cards**: Explore curated listings with detailed salary information and experience requirements.
- **One-Click Apply**: Seamlessly apply for roles with a single click, tracking all applications in a personal dashboard.
- **Responsive Profile**: Manage your professional identity and track career progress.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Vanilla JavaScript (ES6+), HTML5, CSS3 (Modern Flex/Grid), SVG Animation |
| **Backend** | Python 3.x, Django 5.x, Django REST Framework (DRF) |
| **Auth** | JWT (JSON Web Tokens), Role-Based Access Control (RBAC) |
| **Database** | SQLite3 (Development), PostgreSQL (Production Ready) |
| **Styling** | Custom Design System (Fluid Typography, Dual-Tone Palette) |

---

## 🚀 Getting Started

### 1️⃣ Prerequisites
- Python 3.10+
- A modern web browser
- `pip` (Python package manager)

### 2️⃣ Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start the server
python manage.py runserver
```

### 3️⃣ Frontend Setup
The frontend is built with vanilla technologies and requires no build step. For the best experience, serve it via a local server:
```bash
# Using Python's built-in server
cd frontend
python -m http.server 8080
```
Then visit: `http://localhost:8080/index.html`

---

## 📂 Project Architecture

```text
├── backend/                # Django REST API
│   ├── core/               # Main Application Logic (Models, Views, Serializers)
│   ├── config/             # Project Configuration (Settings, URLs)
│   └── requirements.txt    # Python Dependencies
├── frontend/               # Vanilla JS Frontend
│   ├── assets/             # CSS, JS, Images, and Global Styles
│   ├── dashboard.html      # Admin Control Panel
│   ├── job-manage.html     # Listing Management
│   ├── job-create.html     # Listing Creation
│   ├── job-edit.html       # Listing Modification
│   └── index.html          # Global Landing Page
└── start.bat               # Automated system startup script
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:
1. **Fork** the repository.
2. Create a **Feature Branch** (`git checkout -b feature/AmazingFeature`).
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`).
4. **Push** to the branch (`git push origin feature/AmazingFeature`).
5. Open a **Pull Request**.

---

## 👥 Lead Developer
**Zeyad Abdelmonem** - [GitHub](https://github.com/zeyadabmonem)

---


<p align="center">
  Built with ❤️ by the JobFinder Team
</p>
