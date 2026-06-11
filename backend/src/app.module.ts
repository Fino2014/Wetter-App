import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // Hier binden wir PostgreSQL und TypeORM ein
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',      
      port: 5432,             
      username: 'postgres',   
      password: 'elisa', 
      database: 'wetter_app', 
      autoLoadEntities: true,
      synchronize: true,      
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}