import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './service';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @Get()
  async getWeather(@Query('city') city: string) {
    return this.weatherService.getWeather(city);
  }
}