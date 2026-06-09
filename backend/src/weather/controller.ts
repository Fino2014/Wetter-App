import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getWeather(@Query('lat') lat: string, @Query('lon') lon: string) {
    return await this.weatherService.getConsolidatedData(lat, lon);
  }
}
