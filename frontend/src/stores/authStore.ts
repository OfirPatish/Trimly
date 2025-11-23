import { create } from "zustand";
import { api } from "@/lib/api";
import type { User, LoginCredentials, RegisterData } from "@/types";
import type { QueryClient } from "@tanstack/react-query";

// QueryClient is set by QueryProvider to enable cache invalidation after auth actions
let queryClient: QueryClient | null = null;

export const setQueryClient = (client: QueryClient) => {
  queryClient = client;
};

interface AuthState {
  user: User | null;
  loading: boolean;
  loginLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// Minimum loading durations to prevent flash of content and improve UX
const MIN_LOADING_DURATION = 600;
const MIN_LOGIN_DURATION = 1500;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  loginLoading: false,

  checkAuth: async () => {
    const startTime = Date.now();
    const token = localStorage.getItem("token");

    if (!token) {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_LOADING_DURATION - elapsed);
      setTimeout(() => {
        set({ loading: false });
      }, remaining);
      return;
    }

    try {
      const { user } = await api.getMe();
      set({ user, loading: false });
    } catch (error) {
      // Only remove token if it's an authentication error (401), not network errors
      // Network errors mean backend is down, but token is still valid
      const isAuthError =
        error instanceof Error &&
        (error.message.includes("session has expired") ||
          error.message.includes("don't have permission"));
      
      if (isAuthError) {
        localStorage.removeItem("token");
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_LOADING_DURATION - elapsed);
        setTimeout(() => {
          set({ user: null, loading: false });
        }, remaining);
      } else {
        // Network error - keep token and current user state
        // User will appear logged in with cached data until backend is back
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_LOADING_DURATION - elapsed);
        setTimeout(() => {
          set({ loading: false });
        }, remaining);
      }
    }
  },

  login: async (credentials: LoginCredentials) => {
    const startTime = Date.now();
    set({ loginLoading: true });

    try {
      const { token, user } = await api.login(credentials);
      localStorage.setItem("token", token);

      // Ensure minimum loading duration to prevent flash of content
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_LOGIN_DURATION - elapsed);
      await new Promise((resolve) => setTimeout(resolve, remaining));

      set({ user, loginLoading: false });

      // Invalidate queries to refresh user-specific data after login
      if (queryClient) {
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        queryClient.invalidateQueries({ queryKey: ["barber", "appointments"] });
        queryClient.invalidateQueries({ queryKey: ["availability"] });
      }
    } catch (error) {
      set({ loginLoading: false });
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    const startTime = Date.now();
    set({ loginLoading: true });

    try {
      const { token, user } = await api.register(data);
      localStorage.setItem("token", token);

      // Ensure minimum loading duration to prevent flash of content
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_LOGIN_DURATION - elapsed);
      await new Promise((resolve) => setTimeout(resolve, remaining));

      set({ user, loginLoading: false });

      // Invalidate queries to refresh user-specific data after registration
      if (queryClient) {
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        queryClient.invalidateQueries({ queryKey: ["barber", "appointments"] });
        queryClient.invalidateQueries({ queryKey: ["availability"] });
      }
    } catch (error) {
      set({ loginLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });

    // Clear all queries on logout
    if (queryClient) {
      queryClient.clear();
    }
  },
}));
