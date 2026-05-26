# Fullstack User Management System

Aplicación Full Stack desarrollada como prueba técnica utilizando React + ASP.NET Core Web API.

El proyecto incluye autenticación JWT, manejo de roles, CRUD de usuarios, validaciones, protección de rutas y una interfaz moderna y responsive.

---

# Estructura del Proyecto

```bash
frontend/
backend/
```

- `frontend/` → aplicación React + Vite
- `backend/` → API ASP.NET Core Web API

---

# Tecnologías Utilizadas

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

# Funcionalidades Principales

## Autenticación
- Registro de usuarios
- Inicio de sesión con JWT
- Protección de rutas
- Autorización basada en roles
- Logout

## Gestión de Usuarios

### Admin
- Ver todos los usuarios
- Crear usuarios
- Editar usuarios
- Eliminar usuarios
- Activar / desactivar usuarios
- Cambiar roles

### User
- Ver su propio perfil
- Editar únicamente su perfil

---

# UI / UX

- Diseño responsive
- Búsqueda de usuarios
- Paginación
- Mensajes de error amigables
- Modal de confirmación para eliminar
- Manejo de errores cuando el backend no está disponible

---

# Requisitos Previos

Antes de ejecutar el proyecto se necesita instalar:

- .NET 8 SDK
- Node.js 18+
- SQL Server Express o LocalDB
- Git

---

# Configuración del Backend

## 1. Entrar a la carpeta backend

```bash
cd backend
```

---

## 2. Restaurar paquetes

```bash
dotnet restore
```

---

## 3. Configurar User Secrets

### Inicializar secrets

```bash
dotnet user-secrets init
```

### Configurar JWT Secret

```bash
dotnet user-secrets set "Jwt:Key" "YOUR_SECRET_KEY"
```

### Configurar Connection String

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost\\SQLEXPRESS;Database=FullStackDb;Trusted_Connection=True;TrustServerCertificate=True;"
```

---

## 4. Ejecutar migraciones

```bash
dotnet ef database update
```

Este comando crea la base de datos y aplica automáticamente las migraciones de Entity Framework.

---

## 5. Ejecutar backend

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

# Configuración del Frontend

## 1. Entrar a frontend

```bash
cd frontend
```

---

## 2. Instalar dependencias

```bash
npm install
```

---

## 3. Ejecutar frontend

```bash
npm run dev
```

Frontend:
```bash
http://localhost:5173
```

---

# Credenciales de Prueba

## Administrador

```txt
Email: admin@demo.com
Password: Admin123!
```

## Usuario

```txt
Email: user@demo.com
Password: User123!
```

---

# Pruebas de API

Swagger está disponible en:

```bash
http://localhost:5009/swagger
```

## Ejemplo Login

```json
{
  "email": "admin@demo.com",
  "password": "Admin123!"
}
```

Después de iniciar sesión, copiar el token JWT y autorizar Swagger utilizando:

```text
Authorize → Bearer <token>
```

---

# Seguridad Implementada

- Contraseñas cifradas utilizando BCrypt
- JWT con expiración
- Autorización basada en roles
- Protección de rutas
- Variables sensibles almacenadas mediante User Secrets
- Validaciones tanto en frontend como backend

---

# Mejoras Futuras

- Refresh Tokens
- Persistencia real de avatares
- Paginación y filtrado desde API
- Docker Compose
- Testing automatizado
- Sistema de logging
- Mejoras de accesibilidad

---

# Autor

Joseph Emmanuel Rodriguez Ramirez
