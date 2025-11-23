// Request body types for API endpoints

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateAppointmentRequest {
  appointmentDate: string;
  barberId: string;
  serviceId?: string;
  price?: number;
  notes?: string;
}

export interface UpdateAppointmentStatusRequest {
  status: "cancelled";
}

export interface CreateScheduleRequest {
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isActive?: boolean;
}

export interface UpdateScheduleRequest {
  startTime?: string; // HH:MM format
  endTime?: string; // HH:MM format
  isActive?: boolean;
}
