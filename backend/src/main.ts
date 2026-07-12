import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS aktivieren: Das erlaubt deinem Frontend (Opera-Browser), 
  // die Daten von diesem Backend abzurufen!
  app.enableCors(); 

  await app.listen(3000);
}
bootstrap();