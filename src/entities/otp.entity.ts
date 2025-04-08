import { 
    BaseEntity, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    DeleteDateColumn, 
    Entity, 
    PrimaryGeneratedColumn, 
    ManyToOne, 
    JoinColumn, 
    Unique 
  } from 'typeorm';
  import { User } from './user.entity';
  
  @Entity('otps')
  @Unique(['userId', 'otp'])  
  export class Otp extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id!: number;
  
    @Column()
    userId: number;
  
    @Column()
    otp: string;
  
    @Column({ type: 'timestamp' })
    expiresAt: Date;
  
    @CreateDateColumn({ type: 'timestamp' })
    readonly createdAt!: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    readonly updatedAt!: Date;
  
    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    readonly deletedAt: Date; 
  
    @ManyToOne(() => User, (user) => user.otps)
    @JoinColumn({ name: 'userId' })
    user: User;
  }
  