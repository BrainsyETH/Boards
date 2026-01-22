// src/hooks/useWeather.ts
// React Query hook for fetching weather data

import { useQuery } from '@tanstack/react-query';
import { fetchWeather, getCityForRiver, type WeatherData } from '@/lib/weather/openweather';

export function useWeather(riverSlug: string | null) {
  return useQuery({
    queryKey: ['weather', riverSlug],
    queryFn: async (): Promise<WeatherData | null> => {
      if (!riverSlug) return null;
      
      const cityData = getCityForRiver(riverSlug);
      if (!cityData) return null;
      
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      if (!apiKey) {
        console.warn('OpenWeatherMap API key not configured');
        return null;
      }
      
      try {
        return await fetchWeather(cityData.lat, cityData.lon, apiKey);
      } catch (error) {
        console.error('Error fetching weather:', error);
        return null;
      }
    },
    enabled: !!riverSlug,
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
  });
}
