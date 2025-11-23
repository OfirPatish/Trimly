import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  isActive?: boolean; // Optional for backward compatibility
}

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { services } = await api.getServices();
      return services;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - services don't change often
  });
}

/**
 * Get all services (active and inactive) for barbers
 */
export function useAllServices() {
  return useQuery({
    queryKey: ["services", "all"],
    queryFn: async () => {
      const { services } = await api.getAllServices();
      return services;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - services don't change often
  });
}
