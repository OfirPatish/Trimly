# Trimly - Barber Appointment Booking System

A full-stack web application for managing barber shop appointments with separate customer and barber dashboards.

**🌐 Live Demo:** [https://trimly-frontend.onrender.com](https://trimly-frontend.onrender.com)

**🧪 Demo Accounts:**

- **Customer:** `demo.customer@trimly.com` / `DemoCustomer123`
- **Barber:** `demo.barber@trimly.com` / `DemoBarber123`

## 🚀 Tech Stack

**Backend:** Node.js, Express, TypeScript, PostgreSQL, Prisma ORM  
**Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui  
**State Management:** React Query, Zustand  
**Authentication:** JWT tokens

## ✨ Key Features

- **Customer Dashboard:** Book appointments, view upcoming bookings, manage cancellations
- **Barber Dashboard:** Manage schedule, services, appointments, and view analytics
- **Smart Booking:** Real-time availability checking, overlap prevention, service duration-aware scheduling
- **Business Rules:** Advance booking requirements, cancellation deadlines, daily appointment limits
- **Responsive Design:** Mobile-first approach with modern UI components

## 🏃 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Backend Setup

```bash
cd backend
npm install
# Create .env with DATABASE_URL, JWT_SECRET, PORT=3000
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
# Create .env.local with NEXT_PUBLIC_API_URL=http://localhost:3000/api
npm run dev
```

**Ports:** Backend (3000) | Frontend (3001)

## 📁 Project Structure

```
trimly/
├── backend/     # Express API with TypeScript
└── frontend/    # Next.js application
```

## 🔒 Security & Validation

- JWT-based authentication with password hashing
- Input validation and sanitization
- Rate limiting and CORS protection
- SQL injection prevention (Prisma ORM)
- Comprehensive business logic validation
