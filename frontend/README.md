# Frontend Application

Modern web application built with Next.js for booking and managing barber appointments.

**🌐 Live Demo:** [https://trimly-frontend.onrender.com](https://trimly-frontend.onrender.com)

**🧪 Demo Account:** `test@gmail.com` / `123456`

## 🛠️ Tech Stack

- **Framework:** Next.js 16 + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** React Query (server state), Zustand (client state)
- **Date Handling:** date-fns

## 🚀 Setup

1. Install dependencies: `npm install`
2. Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```
3. Run development server: `npm run dev`

Runs on `http://localhost:3001`

## ✨ Features

### Customer Features
- **Appointment Booking:** Select barber, service, date, and time with real-time availability
- **Appointment Management:** View upcoming appointments, cancel with advance notice
- **Smart Validation:** Overlap prevention, service duration-aware slot filtering

### Barber Features
- **Dashboard:** Statistics overview (appointments, revenue, customers)
- **Schedule Management:** Set working hours per date with calendar interface
- **Service Management:** Create, edit, and delete services with custom pricing
- **Appointment Management:** View, filter, and manage all appointments

### UI/UX
- **Responsive Design:** Mobile-first approach with Tailwind CSS
- **Real-time Updates:** Automatic data refresh using React Query
- **Modern Components:** shadcn/ui component library
- **Form Validation:** Client-side validation with clear error messages
- **Loading States:** Smooth loading indicators and skeletons

## 📱 Pages

- **Home:** Hero section, services showcase, contact information
- **Login/Register:** Authentication forms with validation
- **Appointments (Customer):** Booking and management interface
- **Barber Dashboard:** Complete barber management interface
