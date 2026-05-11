# 🐄 DairyPro — Full-Stack Dairy Farm Management System

A complete MERN stack web application for managing dairy farms, milk collection centers, and dairy cooperatives.

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <repo-url>
cd dairy-farm-management
npm run install-all
```

### 2. Configure Environment
```bash
# Server
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI, JWT secret, Cloudinary keys

# Client
cp client/.env.example client/.env
# Edit VITE_API_URL if needed
```

### 3. Run Development
```bash
npm run dev
# Backend → http://localhost:5000
# Frontend → http://localhost:5173
```

### 4. Seed Demo Data (optional)
```bash
cd server && node utils/seeder.js
```
**Demo Login:** `admin@farm.com` / `admin123`

---

## 📁 Project Structure

```
dairy-farm-management/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Modal, Table, Badge, StatCard, etc.
│   │   │   └── layout/         # Sidebar, Topbar, AppLayout
│   │   ├── context/            # AuthContext, ThemeContext
│   │   ├── hooks/              # useApi, useDebounce
│   │   ├── pages/              # All page components
│   │   ├── services/           # Axios API instance
│   │   └── styles/             # Tailwind CSS
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── server/                     # Node.js + Express Backend
    ├── config/                 # DB + Cloudinary config
    ├── controllers/            # Route logic handlers
    ├── middleware/              # JWT auth middleware
    ├── models/                 # Mongoose schemas
    ├── routes/                 # Express route files
    ├── utils/                  # Token gen, error, seeder
    └── server.js               # Entry point
```

---

## ✨ Features

| Module | Features |
|--------|----------|
| 🐄 Animals | Add/Edit/Delete cows & buffaloes, breed tracking, health status, pregnancy |
| 🥛 Milk Production | Morning/evening sessions, auto totals, weekly/monthly charts |
| 🌿 Feeding | Feed schedules, stock inventory, low-stock alerts |
| 💊 Health | Vaccinations, treatments, vet visits, upcoming reminders |
| 👥 Employees | Staff management, attendance, salary tracking |
| 🛒 Sales | Customer management, invoicing, pending payment tracking |
| 💸 Expenses | Category-wise expense tracking, monthly summaries |
| 📦 Inventory | Medicines, equipment, tools — with stock alerts |
| 📊 Reports | Production, financial, animal analytics with charts |
| 🔐 Auth | JWT login/register, role-based access (admin/farmer/worker/accountant) |
| 🌙 Theme | Dark/Light mode toggle |

---

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Recharts, React Router v6, Axios, React Hot Toast, React Icons

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Multer, Cloudinary, Morgan, Helmet

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/animals` | Get all animals |
| POST | `/api/animals` | Add animal |
| GET | `/api/milk` | Get milk records |
| POST | `/api/milk` | Add milk entry |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/health/vaccinations/upcoming` | Upcoming vaccinations |
| GET | `/api/reports/financial` | Financial report |
| GET | `/api/reports/production` | Production report |

Full API docs: see `docs/API.md`

---

## 🌱 Environment Variables

### Server `.env`
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/dairy_farm_db
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Client `.env`
```
VITE_API_URL=http://localhost:5000/api
```

---

## 📝 License
MIT — Free to use for personal and commercial projects.

Built with 🌿 for farmers, dairy owners, and cooperatives.
