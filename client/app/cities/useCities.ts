import { useQuery } from "@tanstack/react-query";
import { components } from "../types/api";
import { apiClient } from "../api/client";

type City = components["schemas"]["ManyCitiesResponse"];

export function useCities() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await apiClient.get<City>(`/city`);
      return data.cities;
    },
  });
}
