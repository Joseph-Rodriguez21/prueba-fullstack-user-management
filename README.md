# Fullstack User Management System

Aplicación Full Stack desarrollada como prueba técnica utilizando React + ASP.NET Core Web API.

El proyecto incluye autenticación JWT, roles de usuario, CRUD de usuarios, validaciones, protección de rutas y una interfaz moderna y responsive.

---

# Repository Structure

```bash
frontend/
backend/
```

- `frontend/` → aplicación React + Vite
- `backend/` → API ASP.NET Core Web API

---

# Technologies

## Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios

## Backend
- ASP.NET Core Web API (.NET 8)
- Entity Framework Core
- SQL Server
- JWT Authentication
- BCrypt Password Hashing

---

# Main Features

## Authentication
- User registration
- JWT login authentication
- Protected routes
- Role-based authorization
- Logout

## User Management
### Admin
- View all users
- Create users
- Edit users
- Delete users
- Activate / deactivate users
- Change user roles

### User
- View own profile
- Edit own profile only

## UI / UX
- Responsive design
- User search
- Pagination
- Friendly error messages
- Delete confirmation modal
- Backend failure handling

---

# Requirements

Before running the project, install:

- .NET 8 SDK
- Node.js 18+
- SQL Server Express or LocalDB
- Git

---

# Backend Setup

## 1. Enter backend folder

```bash
cd backend
```

---

## 2. Restore packages

```bash
dotnet restore
```

---

## 3. Configure User Secrets

### Initialize secrets

```bash
dotnet user-secrets init
```

### JWT Secret

```bash
dotnet user-secrets set "Jwt:Key" "YOUR_SECRET_KEY"
```

### SQL Server Connection String

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost\\SQLEXPRESS;Database=FullStackDb;Trusted_Connection=True;TrustServerCertificate=True;"
```

---

## 4. Run migrations

```bash
dotnet ef database update
```

This creates the database and applies Entity Framework migrations automatically.

---

## 5. Run backend

```bash
dotnet run
```

Backend:
```bash
http://localhost:5009
```

Swagger:
```bash
http://localhost:5009/swagger
```

---

# Frontend Setup

## 1. Enter frontend folder

```bash
cd frontend
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Run frontend

```bash
npm run dev
```

Frontend:
```bash
http://localhost:5173
```

---

# Demo Credentials

## Admin

```txt
Email: admin@demo.com
Password: Admin123!
```

## User

```txt
Email: user@demo.com
Password: User123!
```

---

# API Testing

Swagger is available at:

```bash
http://localhost:5009/swagger
```

## Example Login Request

```json
{
  "email": "admin@demo.com",
  "password": "Admin123!"
}
```

After login, copy the JWT token and authorize Swagger using:

```text
Authorize → Bearer <token>
```

---

# Security

- Passwords hashed using BCrypt
- JWT authentication with expiration
- Role-based authorization
- Protected routes
- Sensitive variables stored using User Secrets
- Frontend and backend validations

---

# Future Improvements

- Refresh Tokens
- Persistent avatar upload
- API pagination and filtering
- Docker Compose
- Automated testing
- Logging system
- Accessibility improvements

---

# Author

Joseph Emmanuel Rodriguez Ramirez
