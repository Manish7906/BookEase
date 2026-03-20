# 📅 BookEase — Online Service Booking System
## Spring Boot Backend

---

## 🏗️ Project Structure

```
src/main/java/com/bookease/
├── BookingBackendApplication.java     ← Main entry point
├── config/
│   ├── SecurityConfig.java            ← JWT + CORS + Security rules
│   ├── GlobalExceptionHandler.java    ← Centralized error handling
│   └── DataSeeder.java                ← Auto-seeds admin + sample services
├── controller/
│   ├── AuthController.java            ← /api/auth/**
│   ├── ServiceController.java         ← /api/services/** and /api/admin/services/**
│   └── BookingController.java         ← /api/bookings/** and /api/admin/bookings/**
├── dto/
│   └── BookEaseDtos.java              ← All Request/Response DTOs
├── entity/
│   ├── User.java                      ← users table
│   ├── Service.java                   ← services table
│   └── Booking.java                   ← bookings table
├── repository/
│   ├── UserRepository.java
│   ├── ServiceRepository.java
│   └── BookingRepository.java
├── security/
│   ├── JwtUtil.java                   ← Token generation & validation
│   ├── JwtAuthFilter.java             ← Intercepts every request
│   └── CustomUserDetailsService.java  ← Loads user from DB
└── service/
    ├── AuthService.java               ← Register & Login logic
    ├── ServiceManagementService.java  ← CRUD for services
    └── BookingService.java            ← Booking logic
```

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Java 17+
- Maven 3.8+
- PostgreSQL 14+

### 2. Create the Database
```sql
CREATE DATABASE bookease_db;
```

### 3. Configure application.properties
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/bookease_db
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
```

### 4. Run the Application
```bash
mvn spring-boot:run
```

The server starts at **http://localhost:8080**

On startup, the app automatically:
- Creates all database tables (via JPA ddl-auto=update)
- Seeds an admin user: `admin@bookease.com` / `admin123`
- Seeds 6 sample services

---

## 🔌 API Reference

### Base URL: `http://localhost:8080/api`

---

### 🔐 Authentication (Public)

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | `{name, email, password}` | Register new user |
| POST | `/auth/login` | `{email, password}` | Login, returns JWT token |

**Example — Register:**
```json
POST /api/auth/register
{
  "name": "Ravi Kumar",
  "email": "ravi@example.com",
  "password": "secret123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGci...",
    "type": "Bearer",
    "id": 1,
    "name": "Ravi Kumar",
    "email": "ravi@example.com",
    "role": "USER"
  }
}
```

**Using the token:** Add to all protected requests:
```
Authorization: Bearer eyJhbGci...
```

---

### 🛍️ Services (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/services` | Get all active services |
| GET | `/services/{id}` | Get service by ID |

---

### 📋 Bookings (User — Requires JWT)

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/bookings` | `{serviceId, bookingDate, notes?}` | Create a booking |
| GET | `/bookings/my` | — | Get my bookings |
| GET | `/bookings/{id}` | — | Get single booking |
| PATCH | `/bookings/{id}/cancel` | — | Cancel a booking |

**Example — Create Booking:**
```json
POST /api/bookings
Authorization: Bearer eyJhbGci...
{
  "serviceId": 1,
  "bookingDate": "2026-03-20",
  "notes": "Prefer morning slot"
}
```

---

### 🛠️ Admin Endpoints (ADMIN role only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/services` | Get all services (incl. inactive) |
| POST | `/admin/services` | Create new service |
| PUT | `/admin/services/{id}` | Update service |
| DELETE | `/admin/services/{id}` | Deactivate service |
| GET | `/admin/bookings` | View all bookings |
| PATCH | `/admin/bookings/{id}/status` | Update booking status |
| GET | `/admin/bookings/stats` | Booking statistics |

---

## 🗄️ Database Schema

```
users
  id | name | email | password | role | created_at

services
  id | name | description | category | icon | duration | price | is_active | created_at

bookings
  id | user_id (FK) | service_id (FK) | booking_date | status | notes | created_at | updated_at
```

**Booking Status Values:** `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`

---

## 🔐 Security Architecture

```
Request → JwtAuthFilter
              ↓
         Extract JWT from Authorization header
              ↓
         Validate token → Load user from DB
              ↓
         Set SecurityContext → Route to Controller
              ↓
         @PreAuthorize checks role (USER / ADMIN)
```

---

## 🌐 Connecting to React Frontend

In your React app, call the APIs like this:

```javascript
// Login
const res = await fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { data } = await res.json();
const token = data.token;

// Authenticated request
const bookings = await fetch('http://localhost:8080/api/bookings/my', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## 🚀 Production Tips

1. Change the JWT secret in `application.properties` to a long random string
2. Set `spring.jpa.hibernate.ddl-auto=validate` in production
3. Use environment variables for DB credentials (never hardcode)
4. Add rate limiting for auth endpoints
5. Enable HTTPS
