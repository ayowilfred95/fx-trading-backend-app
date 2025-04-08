import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne, Unique, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BaseEntity } from "typeorm";
import { User } from "../entities/user.entity";
import { Transaction } from "../entities/transaction.entity";
import { WalletBalance } from "../entities/wallet-balance.entity";

@Entity()
@Unique(['user']) // Ensures one currency per user
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'integer' })
  userId: number;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  readonly deletedAt: Date;

  @OneToOne(() => User, (user) => user.wallet)
  @JoinColumn()
  user: User;

  // One wallet has many currency balances
  @OneToMany(() => WalletBalance, (balance) => balance.wallet)
  balances: WalletBalance[];

  // One wallet has many transactions
  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: Transaction[];
}
