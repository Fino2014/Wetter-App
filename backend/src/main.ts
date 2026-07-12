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
<<<<<<< HEAD
  // HTTP-Server starten
=======
  
  // CORS aktivieren: Das erlaubt deinem Frontend (Opera-Browser), 
  // die Daten von diesem Backend abzurufen!
  app.enableCors(); 

>>>>>>> ca44d06c1bc14019f733b6df1f4fb3ddbee752ae
  await app.listen(3000);
}
bootstrap();