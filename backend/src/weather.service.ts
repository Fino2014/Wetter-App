import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class WeatherService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getWeatherData(stadt: string) {
    try {
      // Holt die Daten per SQL-Abfrage direkt aus deiner Tabelle "weather_data"
      // und ignoriert dabei die Groß-/Kleinschreibung der Stadt
      const result = await this.dataSource.query(
        `SELECT * FROM weather_data WHERE LOWER(stadt) = LOWER($1) LIMIT 1`,
        [stadt]
      );

      // Wenn die Stadt in der Datenbank gefunden wurde
      if (result && result.length > 0) {
        return result[0];
      }
    } catch (error) {
      console.error("Datenbankabfrage-Fehler:", error);
    }

    // Fallback: Wenn die Stadt NICHT in der Datenbank steht
    return {
      stadt: stadt,
      temperatur: '15°C',
      wetter: 'Wechselhaft',
      hinweis: 'Für diese Stadt wurden dynamische Standardwerte geladen.',
    };
  }
}