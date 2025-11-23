// Response types for API endpoints

export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
  errors?: Array<{ msg: string; param?: string }>;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    role: string;
    createdAt?: Date;
  };
}

export interface AppointmentResponse {
  id: string;
  userId: string;
  barberId: string;
  appointmentDate: Date;
  serviceId?: string | null;
  serviceType?: string | null;
  price?: number | null;
  status: string;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  barber?: {
    id: string;
    name: string;
  };
  service?: {
    serviceId: string;
    name: string;
    price: number;
    duration: number;
  };
}

export interface BarberResponse {
  id: string;
  name: string;
}

export interface ServiceResponse {
  id: string;
  name: string;
  price: number;
  duration: number;
}
