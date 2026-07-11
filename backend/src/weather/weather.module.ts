/**
 * weather.module.ts
 * Feature-Modul für alle Wetterdaten-Funktionalitäten.
 * Registriert die TypeORM-Entity, den Service und den Controller.
 * Setzt TypeOrmModule.forRoot() in AppModule voraus.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherService } from './service';
import { WeatherController } from './controller';
import { WeatherData } from './entities/weather-data.entity';

@Module({
  imports: [
    // Stellt das WeatherData-Repository für Dependency Injection bereit
    TypeOrmModule.forFeature([WeatherData]),
  ],
  providers: [WeatherService],
  controllers: [WeatherController],
  exports: [WeatherService],
})
export class WeatherModule {}
