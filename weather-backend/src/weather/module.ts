import { Module } from '@nestjs/common';
import { AppController } from './controller';
import { AppService } from './service';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

@Module({
  imports: [],
  
  controllers: [AppController, WeatherController],  
  providers: [AppService, WeatherService],       
})
export class AppModule {}