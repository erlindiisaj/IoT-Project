import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { APIClient } from "src/apiClient";

export interface WeatherData {
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
  };
  location: {
    name: string;
    country: string;
    localtime: string;
  };
}

const API_KEY = "95975597a7fd4eb4b36160402231803";

export const useWeather = () => {
  const queryClient = useQueryClient();

  const apiClient = new APIClient<WeatherData>(
    `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=Canakkale`
  );

  const getWeather = useSuspenseQuery<WeatherData, Error>({
    queryKey: ["WEATHER_API", "Çanakkale"],
    queryFn: () => apiClient.getSingle(), // You may need to implement `.getSingle()` in your APIClient
  });

  return {
    getWeather,
    refetch: () =>
      queryClient.invalidateQueries({ queryKey: ["WEATHER_API", "Canakkale"] }),
  };
};
