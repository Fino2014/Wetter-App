import { NestFactory } from '@nestjs/core';
import { AppModule } from './module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS aktivieren (für Frontend)
  app.enableCors({
    origin: 'http://localhost:3001', // Frontend-URL
    methods: 'GET',
  });

  await app.listen(3000);
  console.log('Backend läuft auf: http://localhost:3000');
}
bootstrap();