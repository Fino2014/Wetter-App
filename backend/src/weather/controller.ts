/**
 * controller.ts — WeatherController
 * REST-Controller für den Wetter-Endpunkt.
 * Empfängt HTTP-GET-Anfragen auf /weather und delegiert an den WeatherService.
 * Beispielaufruf: GET /weather?city=berlin
 */
import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './service';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  // Gibt aktuelle Wetterdaten für die angegebene Stadt zurück
  @Get()
  async getWeather(@Query('city') city: string) {
    return this.weatherService.getWeather(city);
  }
}
