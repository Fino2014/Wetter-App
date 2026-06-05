import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherService } from './service';
import { WeatherController } from './controller';
import { WeatherData } from './entities/weather-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WeatherData])],
  providers: [WeatherService],
  controllers: [WeatherController],
})
export class WeatherModule {}