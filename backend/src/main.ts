/**
 * main.ts
 * Einstiegspunkt der NestJS-Anwendung.
 * Erstellt die App-Instanz und startet den HTTP-Server auf Port 3000.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // NestJS-Anwendung mit dem Wurzelmodul initialisieren
  const app = await NestFactory.create(AppModule);
  // HTTP-Server starten
  await app.listen(3000);
}
bootstrap();