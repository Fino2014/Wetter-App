/**
 * ai.service.ts — AiService
 * Kernlogik der KI-Integration.
 * Ablauf:
 *   1. Wetterdaten für die angefragte Stadt über WeatherService abrufen
 *   2. Einen Prompt (Textnachricht) mit den Wetterdaten zusammenbauen
 *   3. Den Prompt an die Gemini KI-API schicken
 *   4. Die Antwort auf Deutsch zurückgeben
 */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { WeatherService } from '../weather/service';

@Injectable()
export class AiService {
  // Gemini KI-Client — Verbindung zur Google KI
  private genAI: GoogleGenerativeAI;
  // Das ausgewählte KI-Modell — wird einmal beim Start initialisiert
  private model;

  constructor(
    // WeatherService liefert aktuelle Wetterdaten (Temperatur, Wind, etc.)
    private weatherService: WeatherService,
    // ConfigService liest GEMINI_API_KEY aus der .env Datei
    private configService: ConfigService,
  ) {
    // Verbindung zur Gemini API mit dem API-Key aus der .env Datei aufbauen
    this.genAI = new GoogleGenerativeAI(
      this.configService.get<string>('GEMINI_API_KEY'),
    );

    // gemini-2.5-flash: schnelles und kostenloses Gemini-Modell
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  /**
   * Ruft Wetterdaten ab, baut einen Prompt und fragt die KI.
   * @param city     - Stadtname (z.B. "berlin")
   * @param question - Frage des Nutzers (z.B. "Soll ich einen Regenschirm mitnehmen?")
   * @returns KI-Antwort als Text auf Deutsch
   */
  async getWeatherAdvice(city: string, question: string): Promise<string> {
    // Schritt 1: Aktuelle Wetterdaten für die Stadt laden
    const weather = await this.weatherService.getWeather(city);

    // Schritt 2: Prompt zusammenbauen — die KI bekommt Wetterdaten + Nutzerfrage als Kontext
    const prompt = `Aktuelle Wetterdaten für ${weather.city}:
  - Temperatur: ${weather.temperature}°C
  - Windgeschwindigkeit: ${weather.windSpeed} km/h
  - Wettercode: ${weather.weatherCode}

  Frage des Nutzers: ${question}

  Bitte beantworte die Frage basierend auf den aktuellen Wetterdaten. Antworte auf Deutsch.`;

    try {
      // Schritt 3: Prompt an Gemini schicken und Antwort empfangen
      const result = await this.model.generateContent(prompt);
      const text = result.response.text();

      // Schritt 4: Zeilenumbrüche entfernen und Text bereinigen, bevor er zurückgegeben wird
      return (
        text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim() ||
        'Keine Antwort erhalten.'
      );
    } catch (error: any) {
      console.log('GEMINI FEHLER:', error);
      // Fehler 429 bedeutet: zu viele Anfragen — Nutzer muss kurz warten
      if (error.status === 429) {
        return 'API-Limit erreicht. Bitte warten Sie eine Minute.';
      }
      // Alle anderen Fehler (z.B. ungültiger API-Key, Netzwerkfehler)
      return 'Fehler bei der KI-Anfrage: ' + error.message;
    }
  }
}
