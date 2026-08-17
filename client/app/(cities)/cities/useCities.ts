import { useQuery } from "@tanstack/react-query";
import { components } from "../../types/api";
import { apiClient } from "../../(primary)/api/client";

type City = components["schemas"]["ManyCitiesResponse"];
type CityResponse = components["schemas"]["CityResponse"];

export function useCities() {
  return useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const { data } = await apiClient.get<City>(
        `/city?weather=true&taxes=true`,
      );
      return data.cities;
    },
  });
}

export function useCity(slug: number) {
  return useQuery({
    queryKey: ["city", slug],
    queryFn: async () => {
      const { data } = await apiClient.get<CityResponse>(
        `/city/${slug}?weather=true&taxes=true`,
      );
      return data.city;
    },
    enabled: !!slug,
  });
}
