import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather') 
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get() // Get weather
  async getWeather(@Query('lat') lat: string, @Query('lon') lon: string) {
    return await this.weatherService.getConsolidatedData(lat, lon);
  }
}