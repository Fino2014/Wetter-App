import { Controller, Get } from '@nestjs/common';

@Controller()  // Grund-Route: /
export class AppController {
  @Get()  // GET /
  getHello(): string {
    return 'Willkommen zur Wetter-App! 🌤️';
  }
}