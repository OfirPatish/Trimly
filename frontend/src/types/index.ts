export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: "customer" | "barber";
  createdAt?: string;
}

export interface Appointment {
  id: string;
  userId: string;
  barberId: string;
  serviceId?: string | null;
  appointmentDate: string;
  serviceType: string | null;
  price: number | string | null;
  duration?: number | null; // Duration snapshot at booking time
  status: "cancelled" | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
  barber?: {
    id: string;
    name: string;
  };
  service?: {
    serviceId: string;
    name: string;
    price: number | string;
    duration: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface CreateAppointmentData {
  appointmentDate: string;
  barberId: string;
  serviceId?: string;
  serviceType?: string;
  price?: number;
  notes?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

export interface BarberSchedule {
  id: string;
  barberId: string;
  date: string; // Date in YYYY-MM-DD format
  startTime: string; // Time in HH:MM format (e.g., "09:00")
  endTime: string; // Time in HH:MM format (e.g., "17:00")
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleData {
  date: string; // Date in YYYY-MM-DD format
  startTime: string; // Time in HH:MM format
  endTime: string; // Time in HH:MM format
  isActive?: boolean;
}

export interface UpdateScheduleData {
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
}
