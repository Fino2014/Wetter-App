import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'elisa', // Nutze dein Passwort
      database: 'wetter_app',
      autoLoadEntities: true,
      synchronize: true,
    }),
    // Sichere Pfadauflösung vom Hauptverzeichnis aus
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'Frontend'),
    }),
  ],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class AppModule {}