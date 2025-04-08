import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    DeleteDateColumn,
    UpdateDateColumn,
    CreateDateColumn,
    BaseEntity,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Wallet } from './wallet.entity';
import { User } from './user.entity';
  
  export enum TransactionType {
    FUNDING = 'FUNDING', 
    CONVERSION = 'CONVERSION', 
    TRANSFER = 'TRANSFER',
  }
  
  export enum TransactionStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
  }
  
  @Entity()
  export class Transaction extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => User, (user) => user.transactions)
    @JoinColumn({ name: 'userId' })
    user: User;
  
    @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
    wallet: Wallet;
  
    @Column({ type: 'enum', enum: TransactionType })
    type: TransactionType;
  
    @Column({ length: 3 })
    fromCurrency: string;
  
    @Column({ type: 'decimal', precision: 18, scale: 4 })
    fromAmount: number;
  
    @Column({ length: 3 })
    toCurrency: string;
  
    @Column({ type: 'decimal', precision: 18, scale: 4 })
    toAmount: number;
  
    @Column({ type: 'decimal', precision: 18, scale: 6 })
    rateUsed: number;
  
    @Column({ type: 'enum', enum: TransactionStatus })
    status: TransactionStatus;
  
    @CreateDateColumn({ type: 'timestamp' })
    readonly createdAt!: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    readonly updatedAt!: Date;
  
    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt: Date;
  
    @Column({ nullable: true })
    description: string; 
  }
  