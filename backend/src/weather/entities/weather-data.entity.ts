import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class WeatherData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  city: string;

  @Column('decimal', { precision: 5, scale: 2 })
  temperature: number;

  @Column('decimal', { precision: 5, scale: 2 })
  windSpeed: number;

  @Column()
  weatherCode: number;

  @Column('decimal', { precision: 9, scale: 6 })
  latitude: number;

  @Column('decimal', { precision: 9, scale: 6 })
  longitude: number;

  @CreateDateColumn()
  timestamp: Date;
}