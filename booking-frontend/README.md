# 📅 BookEase — Frontend (React + Vite)

## 🚀 How to Run in VS Code

### Step 1: Open in VS Code
```
File → Open Folder → select this `booking-frontend` folder
```

### Step 2: Open Terminal in VS Code
```
Ctrl + ` (backtick)    ← Windows/Linux
Cmd  + ` (backtick)    ← Mac
```

### Step 3: Install dependencies
```bash
npm install
```

### Step 4: Start the dev server
```bash
npm run dev
```

### Step 5: Open in browser
```
http://localhost:3000
```

---

## ⚠️ IMPORTANT — Backend Must Be Running First!

Before opening the frontend, make sure your **Spring Boot backend** is running on port **8080** in IntelliJ.

The Vite dev server automatically proxies all `/api` requests to `http://localhost:8080` — so no CORS issues.

---

## 🔑 Test Credentials

| Role  | Email                  | Password   |
|-------|------------------------|------------|
| Admin | admin@bookease.com     | admin123   |
| User  | (register any account) | any 6+ chars |

---

## 📁 Project Structure

```
booking-frontend/
├── index.html
├── vite.config.js          ← Proxy config (forwards /api → :8080)
├── package.json
└── src/
    ├── main.jsx            ← Entry point
    ├── App.jsx             ← Router + protected routes
    ├── index.css           ← Global styles
    ├── context/
    │   └── AuthContext.jsx ← Global user state (login/logout/JWT)
    ├── services/
    │   └── api.js          ← ALL backend API calls (axios)
    ├── components/
    │   ├── Navbar.jsx
    │   └── Toast.jsx
    └── pages/
        ├── LandingPage.jsx
        ├── AuthPages.jsx        ← Login + Register
        ├── ServicesPage.jsx     ← Browse + Book services
        ├── DashboardPage.jsx    ← My bookings
        └── AdminPages.jsx       ← Admin dashboard, bookings, services
```

---

## 🔌 API Calls Made by Frontend

| Page            | API Call                          |
|-----------------|-----------------------------------|
| Login           | POST /api/auth/login              |
| Register        | POST /api/auth/register           |
| Services        | GET  /api/services                |
| Book            | POST /api/bookings                |
| My Bookings     | GET  /api/bookings/my             |
| Cancel          | PATCH /api/bookings/{id}/cancel   |
| Admin Stats     | GET  /api/admin/bookings/stats    |
| Admin Bookings  | GET  /api/admin/bookings          |
| Update Status   | PATCH /api/admin/bookings/{id}/status |
| Admin Services  | GET  /api/admin/services          |
| Add Service     | POST /api/admin/services          |
| Deactivate      | DELETE /api/admin/services/{id}   |

---

## 🐞 Common Issues

**"Network Error" or "Failed to fetch"**
→ Spring Boot is not running. Start it in IntelliJ first.

**"401 Unauthorized"**  
→ Your JWT token expired. Just log in again.

**Port conflict on 3000**  
→ Change port in `vite.config.js`: `port: 3001`

**npm not found**  
→ Install Node.js from https://nodejs.org (LTS version)
