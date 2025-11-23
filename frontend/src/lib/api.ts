import type {
  User,
  Appointment,
  LoginCredentials,
  RegisterData,
  CreateAppointmentData,
  AuthResponse,
  BarberSchedule,
  CreateScheduleData,
  UpdateScheduleData,
} from "@/types";

// Backend API URL - defaults to port 3000 (backend)
// Can be overridden with NEXT_PUBLIC_API_URL in .env.local
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Validate API URL in production
if (typeof window !== "undefined" && API_URL.includes("localhost") && process.env.NODE_ENV === "production") {
  console.error("ERROR: NEXT_PUBLIC_API_URL must be set to a production URL in production builds");
}

class ApiClient {
  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  private getErrorMessage(error: unknown, defaultMessage: string): string {
    // Network errors (backend down, CORS, etc.)
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return "Unable to connect to the server. Please check your internet connection or try again later.";
    }

    // Already an Error with a message
    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      // Network-related errors
      if (
        message.includes("failed to fetch") ||
        message.includes("networkerror")
      ) {
        return "Unable to connect to the server. Please check your internet connection or try again later.";
      }

      // Timeout errors
      if (message.includes("timeout") || message.includes("aborted")) {
        return "The request took too long. Please try again.";
      }

      // Return the error message if it's user-friendly, otherwise return default
      if (error.message && error.message !== "Request failed") {
        return error.message;
      }
    }

    return defaultMessage;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = "Something went wrong. Please try again.";

        try {
          const error = await response.json();
          errorMessage = error.error || error.message || errorMessage;
        } catch {
          // If response is not JSON, use status-based messages
          if (response.status === 401) {
            errorMessage = "Your session has expired. Please log in again.";
          } else if (response.status === 403) {
            errorMessage = "You don't have permission to perform this action.";
          } else if (response.status === 404) {
            errorMessage = "The requested resource was not found.";
          } else if (response.status === 500) {
            errorMessage = "Server error. Please try again later.";
          } else if (response.status >= 500) {
            errorMessage = "Server error. Please try again later.";
          } else if (response.status >= 400) {
            errorMessage =
              "Invalid request. Please check your input and try again.";
          }
        }

        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      // Handle network errors and other fetch failures
      const friendlyMessage = this.getErrorMessage(
        error,
        "Something went wrong. Please try again."
      );
      throw new Error(friendlyMessage);
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async getMe(): Promise<{ user: User }> {
    return this.request<{ user: User }>("/auth/me");
  }

  async getBarbers(): Promise<{
    barbers: Array<{ id: string; name: string }>;
  }> {
    return this.request<{
      barbers: Array<{ id: string; name: string }>;
    }>("/barbers");
  }

  async getServices(): Promise<{
    services: Array<{
      id: string;
      name: string;
      price: number;
      duration: number;
    }>;
  }> {
    return this.request<{
      services: Array<{
        id: string;
        name: string;
        price: number;
        duration: number;
      }>;
    }>("/services");
  }

  async getAllServices(): Promise<{
    services: Array<{
      id: string;
      name: string;
      price: number;
      duration: number;
      isActive: boolean;
    }>;
  }> {
    return this.request<{
      services: Array<{
        id: string;
        name: string;
        price: number;
        duration: number;
        isActive: boolean;
      }>;
    }>("/services/all");
  }

  async createService(data: {
    serviceId: string;
    name: string;
    price: number;
    duration: number;
  }): Promise<{
    service: {
      id: string;
      name: string;
      price: number;
      duration: number;
    };
    message: string;
  }> {
    return this.request<{
      service: {
        id: string;
        name: string;
        price: number;
        duration: number;
      };
      message: string;
    }>("/services", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateService(
    serviceId: string,
    data: {
      name: string;
      price: number;
      duration: number;
    }
  ): Promise<{
    service: {
      id: string;
      name: string;
      price: number;
      duration: number;
    };
    message: string;
  }> {
    return this.request<{
      service: {
        id: string;
        name: string;
        price: number;
        duration: number;
      };
      message: string;
    }>(`/services/${serviceId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteService(serviceId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/services/${serviceId}`, {
      method: "DELETE",
    });
  }

  async restoreService(serviceId: string): Promise<{
    service: {
      id: string;
      name: string;
      price: number;
      duration: number;
      isActive: boolean;
    };
    message: string;
  }> {
    return this.request<{
      service: {
        id: string;
        name: string;
        price: number;
        duration: number;
        isActive: boolean;
      };
      message: string;
    }>(`/services/${serviceId}/restore`, {
      method: "POST",
    });
  }

  async getBarberAppointments(params?: {
    status?: "cancelled" | null;
    date?: string;
  }): Promise<{ appointments: Appointment[] }> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.date) queryParams.append("date", params.date);

    const query = queryParams.toString();
    return this.request<{ appointments: Appointment[] }>(
      `/barbers/appointments${query ? `?${query}` : ""}`
    );
  }

  async updateBarberAppointmentStatus(
    id: string,
    status: "cancelled"
  ): Promise<{ appointment: Appointment; message: string }> {
    return this.request<{ appointment: Appointment; message: string }>(
      `/barbers/appointments/${id}/status`,
      {
        method: "PUT",
        body: JSON.stringify({ status }),
      }
    );
  }

  async getAppointments(): Promise<{ appointments: Appointment[] }> {
    return this.request<{ appointments: Appointment[] }>("/appointments");
  }

  /**
   * Get available time slots for a specific date, barber, and optional service.
   * Returns only slots that are available (not conflicting with existing appointments).
   */
  async getAvailability(
    date: string,
    barberId: string,
    serviceId?: string
  ): Promise<{
    availableSlots: string[];
    date: string;
    barberId: string;
  }> {
    const params = new URLSearchParams({
      date,
      barberId,
    });
    if (serviceId) {
      params.append("serviceId", serviceId);
    }
    const url = `/appointments/availability?${params.toString()}`;
    return this.request<{
      availableSlots: string[];
      date: string;
      barberId: string;
    }>(url);
  }

  async createAppointment(
    data: CreateAppointmentData
  ): Promise<{ appointment: Appointment; message: string }> {
    return this.request<{ appointment: Appointment; message: string }>(
      "/appointments",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }

  async deleteAppointment(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/appointments/${id}`, {
      method: "DELETE",
    });
  }

  // Barber Schedule Management
  async getBarberSchedule(date: string): Promise<{
    schedule: BarberSchedule | null;
  }> {
    return this.request<{ schedule: BarberSchedule | null }>(
      `/barbers/schedules?date=${date}`
    );
  }

  async getBarberSchedules(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<{
    schedules: BarberSchedule[];
  }> {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    const query = queryParams.toString();
    return this.request<{ schedules: BarberSchedule[] }>(
      `/barbers/schedules${query ? `?${query}` : ""}`
    );
  }

  async createBarberSchedule(data: CreateScheduleData): Promise<{
    message: string;
    schedule: BarberSchedule;
  }> {
    return this.request<{
      message: string;
      schedule: BarberSchedule;
    }>("/barbers/schedules", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateBarberSchedule(
    scheduleId: string,
    data: UpdateScheduleData
  ): Promise<{
    message: string;
    schedule: BarberSchedule;
  }> {
    return this.request<{
      message: string;
      schedule: BarberSchedule;
    }>(`/barbers/schedules/${scheduleId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteBarberSchedule(scheduleId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(
      `/barbers/schedules/${scheduleId}`,
      {
        method: "DELETE",
      }
    );
  }
}

export const api = new ApiClient();
