import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WeatherService {
  async getConsolidatedData(lat: string, lon: string) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new HttpException('Invalid parameters. Provide numeric lat and lon.', HttpStatus.BAD_REQUEST);
    }

    try {
      // Weather forecast
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation_probability,uv_index,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max,wind_speed_10m_max&timezone=auto&forecast_days=7`;
      
      // Air quality + Pollen
      const pollenUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&timezone=auto&forecast_days=7`;

      const [weatherResponse, pollenResponse] = await Promise.all([
        axios.get(weatherUrl),
        axios.get(pollenUrl),
      ]);

      return {
        latitude: weatherResponse.data.latitude,
        longitude: weatherResponse.data.longitude,
        timezone: weatherResponse.data.timezone,
        current: weatherResponse.data.current,
        hourly_weather: weatherResponse.data.hourly,
        daily_weather: weatherResponse.data.daily,
        hourly_pollen: pollenResponse.data.hourly,
        units: {
          weather_units: weatherResponse.data.current_units,
          pollen_units: pollenResponse.data.hourly_units,
        },
      };
    } catch (error: any) {
      console.error('Open-Meteo Fetch Error:', error.response?.data || error.message);
      throw new HttpException('Failed to fetch weather data from upstream APIs.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}