/**
 * weather-data.entity.ts — WeatherData
 * TypeORM-Entity: definiert die Datenbankstruktur für gespeicherte Wetterdaten.
 * Jede Zeile entspricht einem Wetter-Abruf für eine Stadt zu einem bestimmten Zeitpunkt.
 * Wird von WeatherService zum Speichern und Abrufen von Wetterdaten verwendet.
 */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class WeatherData {
  // Automatisch generierter Primärschlüssel
  @PrimaryGeneratedColumn()
  id: number;

  // Name der abgefragten Stadt
  @Column()
  city: string;

  // Temperatur in Grad Celsius (z.B. 18.50)
  @Column('decimal', { precision: 5, scale: 2 })
  temperature: number;

  // Windgeschwindigkeit in km/h
  @Column('decimal', { precision: 5, scale: 2 })
  windSpeed: number;

  // WMO-Wettercode (z.B. 1 = klar, 61 = Regen)
  @Column()
  weatherCode: number;

  // Geografische Breite der Stadt
  @Column('decimal', { precision: 9, scale: 6 })
  latitude: number;

  // Geografische Länge der Stadt
  @Column('decimal', { precision: 9, scale: 6 })
  longitude: number;

  // Zeitstempel wird automatisch beim Speichern gesetzt
  @CreateDateColumn()
  timestamp: Date;
}