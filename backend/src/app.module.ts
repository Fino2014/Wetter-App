/**
 * app.module.ts
 * Wurzelmodul der NestJS-Anwendung.
 * Bindet die globale Konfiguration (.env), die Datenbank und alle Feature-Module ein.
 * Reihenfolge: ConfigModule zuerst (damit .env geladen ist), dann TypeORM, dann Feature-Module.
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherModule } from './weather/weather.module';
import { AiModule } from './ai/ai.module';
import { WeatherData } from './weather/entities/weather-data.entity';

@Module({
  imports: [
    // Lädt .env global — isGlobal:true bedeutet kein erneuter Import in anderen Modulen nötig
    ConfigModule.forRoot({ isGlobal: true }),
    // SQLite-Datenbank: wird als Datei weather.db im backend-Ordner gespeichert
    // synchronize:true erstellt Tabellen automatisch beim Start (nur für Entwicklung)
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'weather.db',
      entities: [WeatherData],
      synchronize: true,
    }),
    // Wetter-Feature: stellt GET /weather bereit
    WeatherModule,
    // KI-Feature: stellt GET /ai/advice bereit
    AiModule,
  ],
})
export class AppModule {}
