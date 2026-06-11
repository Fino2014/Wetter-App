/**
 * ai.controller.ts — AiController
 * Eingangspunkt (REST-Endpunkt) für KI-Anfragen.
 * Empfängt HTTP-GET-Anfragen auf /ai/advice, liest die Query-Parameter
 * und delegiert die eigentliche Arbeit an den AiService.
 *
 * Beispielaufruf:
 *   GET /ai/advice?city=berlin&question=Soll ich einen Regenschirm mitnehmen?
 *
 * Antwort (JSON):
 *   { "city": "berlin", "question": "...", "answer": "Ja, heute ist Regen..." }
 */
import { Controller, Get, Query } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(
    // AiService wird automatisch von NestJS per Dependency Injection bereitgestellt
    private aiService: AiService,
  ) {}

  // Verarbeitet GET /ai/advice?city=...&question=...
  @Get('advice')
  async getAdvice(
    @Query('city') city: string,         // Stadtname aus der URL (z.B. "berlin")
    @Query('question') question: string, // Nutzerfrage aus der URL
  ) {
    const answer = await this.aiService.getWeatherAdvice(city, question);

    // Gibt city, question und die KI-Antwort als JSON zurück
    return { city, question, answer };
  }
}
