// entities/WalletBalance.ts
import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BaseEntity,
  } from 'typeorm';
  import { Wallet } from '../entities/wallet.entity';
  
  @Entity('wallet_balances')
  @Unique(['wallet', 'currencyCode']) 
  export class WalletBalance extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;
  
  
    @ManyToOne(() => Wallet, (wallet) => wallet.balances)
    @JoinColumn({ name: 'walletId' })
    wallet: Wallet;
  
    @Column({ length: 3 })
    currencyCode: string;
  
    @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
    balance: number;

    @CreateDateColumn({ type: 'timestamp' })
    readonly createdAt!: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    readonly updatedAt!: Date;
  
    @DeleteDateColumn({ type: 'timestamp' })
    readonly deletedAt: Date;
  }
  