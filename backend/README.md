# Backend API

RESTful API built with Node.js, Express, and TypeScript for managing barber appointments.

## 🛠️ Tech Stack

- **Runtime:** Node.js + Express
- **Language:** TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** JWT tokens
- **Validation:** express-validator

## 🚀 Setup

1. Install dependencies: `npm install`
2. Create `.env` file:
   ```env
   DATABASE_URL="postgresql://..."
   JWT_SECRET="your-secret-key"
   PORT=3000
   ```
3. Setup database:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```
4. Run development server: `npm run dev`

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login and get JWT token
- `GET /me` - Get current authenticated user

### Appointments (`/api/appointments`)
- `GET /` - Get all appointments for authenticated user
- `POST /` - Create new appointment (with validation)
- `DELETE /:id` - Cancel appointment (1-hour advance notice required)
- `GET /availability` - Get available time slots

### Barbers (`/api/barbers`)
- `GET /` - Get list of all barbers
- `GET /appointments` - Get barber's appointments
- `GET /schedule/:date` - Get barber's schedule
- `POST /schedule` - Create schedule entry
- `PATCH /schedule/:id` - Update schedule entry
- `DELETE /schedule/:id` - Delete schedule entry

### Services (`/api/services`)
- `GET /` - Get all active services
- `POST /` - Create new service (barber only)
- `PATCH /:id` - Update service (barber only)
- `DELETE /:id` - Delete service (barber only)

All protected routes require JWT token in `Authorization: Bearer <token>` header.

## 🔒 Business Logic

- **Overlap Prevention:** Checks for customer and barber conflicts
- **Advance Booking:** Minimum 15 minutes for same-day, max 3 months ahead
- **Cancellation Rules:** Must cancel at least 1 hour before appointment
- **Daily Limits:** Maximum 2 appointments per day per customer
- **Service Duration:** Affects availability calculations and slot validation

## 🛡️ Security

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- Input validation and sanitization
- SQL injection prevention (Prisma ORM)
