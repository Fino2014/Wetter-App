import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { WeatherData } from './entities/weather-data.entity';

@Injectable()
export class WeatherService {
  // Minimale Stadt-Koordinaten-Map (erweiterbar)
  private cityCoordinates = {
    berlin: { lat: 52.52, lon: 13.41 },
    münchen: { lat: 48.14, lon: 11.57 },
    hamburg: { lat: 53.55, lon: 9.99 },
  };

  constructor(
    @InjectRepository(WeatherData)
    private weatherRepo: Repository<WeatherData>,
  ) {}

  async getWeather(city: string) {
    const coords = this.cityCoordinates[city.toLowerCase()];
    if (!coords) throw new Error('Stadt nicht gefunden');

    // Open-Meteo API (kein API-Key!)
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`,
    );

    const weather = response.data.current_weather;

    // Daten in DB speichern
    await this.weatherRepo.save({
      city,
      temperature: weather.temperature,
      windSpeed: weather.windspeed,
      weatherCode: weather.weathercode,
      latitude: coords.lat,
      longitude: coords.lon,
    });

    return {
      city,
      temperature: weather.temperature,
      windSpeed: weather.windspeed,
      weatherCode: weather.weathercode,
    };
  }
}