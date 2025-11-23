import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useBarbers() {
  return useQuery({
    queryKey: ["barbers"],
    queryFn: async () => {
      const { barbers } = await api.getBarbers();
      return barbers;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - barbers don't change often
  });
}
