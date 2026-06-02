import { Module } from '@nestjs/common';
import { AppController } from './controller';
import { AppService } from './service';

@Module({
  imports: [],          // Keine Module
  controllers: [AppController],  // Nur unser Controller
  providers: [AppService],       // Nur unser Service
})
export class AppModule {}