# Work Manager

A full-stack Work management web application with per-user task isolation, activity tracking, analytics reports, and Google/email authentication.

## Live Demo
- **Frontend (Cloudflare Pages):** https://work-manager-5uq.pages.dev
- **Backend API (Render):** https://work-manager-weep.onrender.com

## Key Features
- **Authentication:** Email/password signup and login (BCrypt password hashing) plus Google OAuth 2.0 Sign-In.
- **Board:** Create, drag-and-drop, and delete tasks across **Draft**, **In Progress**, and **Done** stages with priority badges (`Main Task`, `Secondary Task`, `Tertiary Task`).
- **Per-User Data Isolation:** Tasks and activity logs are scoped to each logged-in user's account.
- **Change-Log Tracking & Reports:** Automatically records task creation and stage transitions with timestamps, displayed per task and in the **Task Reports** dashboard.
- **Profile & Team Directory:** Edit personal profile details under **My Profile** and view workspace members in the **Team** tab.

## Tech Stack
| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, Material-UI (MUI), Axios, `@react-oauth/google` |
| **Backend** | Java, Spring Boot, Spring Data JPA, Spring Security Crypto (BCrypt) |
| **Database** | TiDB Cloud (MySQL-compatible) |
| **Hosting** | Cloudflare Pages (Frontend), Render (Backend) |

## Project Structure
```text
work-manager/
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/       # Dashboard, AuthPage, Sidebar, StageColumn, ReportsView, TeamView, MyProfile
│   │   ├── constants/        # boardConfig.js (API URLs, theme tokens, stage definitions)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env.local            # Local environment variables (gitignored)
└── backend/                  # Spring Boot REST API
    └── src/main/java/com/task_manager/demo/
        ├── AuthController.java
        ├── TaskController.java
        ├── CorsConfig.java
        ├── User.java / Task.java / TaskLog.java
        └── UserRepository.java / TaskRepository.java / TaskLogRepository.java
```

## API Endpoints

### Authentication & Users (`/api`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new account (hashes password with BCrypt) |
| `POST` | `/api/auth/login` | Authenticate with email and password |
| `POST` | `/api/auth/google` | Verify Google ID token and sign in / auto-register |
| `GET` | `/api/users` | List registered workspace members (public fields only) |
| `GET` | `/api/users/{id}` | Fetch a user's profile |
| `PUT` | `/api/users/{id}` | Update a user's profile |

### Tasks & Logs (`/tasks`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/tasks?userId={id}` | Fetch tasks belonging to a user |
| `POST` | `/tasks` | Create a new task and record an initial log |
| `PUT` | `/tasks/{id}` | Update a task and log any stage transition |
| `DELETE` | `/tasks/{id}?userId={id}` | Delete a task owned by the user |
| `GET` | `/tasks/logs?userId={id}` | Fetch all activity logs for the user |
| `GET` | `/tasks/{id}/logs?userId={id}` | Fetch change history for a specific task |

## Local Setup

### Prerequisites
- Node.js 18+
- Java 17+ and Maven
- MySQL 8+ or a TiDB Cloud cluster
- Google Cloud OAuth 2.0 Web Client ID

### 1. Backend Setup
Set these environment variables (or configure them in IntelliJ Run Configurations):
```env
DB_URL=jdbc:mysql://<host>:<port>/work_manager_db?sslMode=VERIFY_IDENTITY
DB_USERNAME=<your-db-username>
DB_PASSWORD=<your-db-password>
```
Run the Spring Boot server:
```bash
mvn spring-boot:run
```

### 2. Frontend Setup
Create a `.env.local` file in the frontend root:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
```
Install dependencies and start the dev server:
```bash
npm install
npm run dev
```
