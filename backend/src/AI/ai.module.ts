/**
 * ai.module.ts — AiModule
 * Registriert alle Bestandteile der KI-Funktionalität bei NestJS.
 * Importiert WeatherModule, damit AiService den WeatherService benutzen darf.
 * Wird in AppModule eingebunden, damit der Endpunkt /ai/advice erreichbar ist.
 */
import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { WeatherModule } from '../weather/weather.module';

@Module({
  // WeatherModule wird importiert, weil AiService den WeatherService braucht
  imports: [WeatherModule],
  // AiService ist die Geschäftslogik — wird per Dependency Injection bereitgestellt
  providers: [AiService],
  // AiController ist die Eingangstür — verarbeitet HTTP-Anfragen auf /ai/advice
  controllers: [AiController],
})
export class AiModule {}
