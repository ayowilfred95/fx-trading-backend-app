import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
@Index(['baseCurrency', 'targetCurrency'], { unique: true })
export class ExchangeRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 3 })
  baseCurrency: string; // e.g., 'NGN'

  @Column({ length: 3 })
  targetCurrency: string; // e.g., 'USD'

  @Column({ type: 'decimal', precision: 18, scale: 6 })
  rate: number; // 1 base unit = [rate] target units

  @Column({ type: 'timestamp' })
  timestamp: Date;
}