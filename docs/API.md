# DairyPro API Documentation

Base URL: `http://localhost:5000/api`

## Authentication
All protected routes require: `Authorization: Bearer <token>`

---

## Auth
| Method | Route | Auth | Body | Description |
|--------|-------|------|------|-------------|
| POST | `/auth/register` | ❌ | name, email, password, role | Register |
| POST | `/auth/login` | ❌ | email, password | Login → returns token |
| GET | `/auth/me` | ✅ | — | Get current user |
| PUT | `/auth/profile` | ✅ | name, phone | Update profile |
| PUT | `/auth/password` | ✅ | currentPassword, newPassword | Change password |

## Animals
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/animals` | ✅ | Get all animals (query: type, healthStatus, search) |
| GET | `/animals/stats` | ✅ | Get animal statistics |
| GET | `/animals/:id` | ✅ | Get single animal |
| POST | `/animals` | admin/farmer | Create animal |
| PUT | `/animals/:id` | admin/farmer | Update animal |
| DELETE | `/animals/:id` | admin | Delete animal |

## Milk
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/milk` | ✅ | Get records (query: startDate, endDate, animalId) |
| GET | `/milk/daily` | ✅ | Today's production total |
| GET | `/milk/monthly` | ✅ | Monthly breakdown (query: year, month) |
| POST | `/milk` | ✅ | Add milk entry |
| PUT | `/milk/:id` | ✅ | Update record |
| DELETE | `/milk/:id` | ✅ | Delete record |

## Sales
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/sales` | ✅ | Get sales (query: startDate, endDate, customerId) |
| GET | `/sales/summary` | ✅ | Monthly summary |
| POST | `/sales` | ✅ | Record new sale |

## Expenses
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/expenses` | ✅ | Get expenses (query: category, startDate, endDate) |
| GET | `/expenses/summary` | ✅ | Category breakdown |
| POST | `/expenses` | ✅ | Add expense |
| PUT | `/expenses/:id` | ✅ | Update |
| DELETE | `/expenses/:id` | ✅ | Delete |

## Dashboard
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/dashboard/stats` | ✅ | All dashboard statistics |

## Reports
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/reports/production` | ✅ | Milk production report |
| GET | `/reports/financial` | ✅ | Revenue/expense/profit report |
