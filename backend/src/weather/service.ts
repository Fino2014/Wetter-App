/**
 * service.ts — WeatherService
 * Geschäftslogik für Wetterdaten.
 * Ruft die Open-Meteo API (kein API-Key erforderlich) auf,
 * speichert das Ergebnis in der Datenbank und gibt es zurück.
 * Wird von WeatherController und zukünftig von AIService verwendet.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { WeatherData } from './entities/weather-data.entity';

@Injectable()
export class WeatherService {
  // Statische Koordinaten-Tabelle für unterstützte Städte (erweiterbar)
  private cityCoordinates = {
    berlin: { lat: 52.52, lon: 13.41 },
    münchen: { lat: 48.14, lon: 11.57 },
    hamburg: { lat: 53.55, lon: 9.99 },
  };

  constructor(
    // TypeORM-Repository wird automatisch per Dependency Injection bereitgestellt
    @InjectRepository(WeatherData)
    private weatherRepo: Repository<WeatherData>,
  ) {}

  async getWeather(city: string) {
    // Koordinaten der Stadt aus der lokalen Map laden
    const coords = this.cityCoordinates[city.toLowerCase()];
    if (!coords) throw new NotFoundException(`Stadt "${city}" nicht gefunden`);

    // Aktuelles Wetter von der Open-Meteo API abrufen (kein API-Key!)
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`,
    );

    const weather = response.data.current_weather;

    // Wetterdaten in der Datenbank persistieren
    await this.weatherRepo.save({
      city,
      temperature: weather.temperature,
      windSpeed: weather.windspeed,
      weatherCode: weather.weathercode,
      latitude: coords.lat,
      longitude: coords.lon,
    });

    // Strukturierte Wetterdaten zurückgeben
    return {
      city,
      temperature: weather.temperature,
      windSpeed: weather.windspeed,
      weatherCode: weather.weathercode,
    };
  }
}
