import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Wallet } from '../../src/entities/wallet.entity';
import { ExchangeRateService } from '../../src/exchange-rate/exchange-rate.service';
import { TransactionService } from '../../src/transaction/transaction.service';
import {
  TransactionStatus,
  TransactionType,
} from '../../src/entities/transaction.entity';
import { appError } from 'lib/helpers/error';
import { User } from 'src/entities/user.entity';
import { WalletBalance } from 'src/entities/wallet-balance.entity';
import { Transaction } from '../../src/entities/transaction.entity';
import { response } from 'express';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,
    private readonly entityManager: EntityManager,
    private readonly exchangeRateService: ExchangeRateService,
    private readonly transactionService: TransactionService,
  ) {}

  async fundWallet(userId: number, amount: number, currencyCode: string) {
    return this.entityManager.transaction(async (manager) => {
      // Log input parameters
      console.log('fundWallet called with:', { userId, amount, currencyCode });

      // Get user's wallet
      const user = await manager.findOne(User, {
        where: { id: userId },
        relations: ['wallet'],
      });

      console.log('Found user:', user);

      if (!user?.wallet) throw appError('User wallet not found');

      // Find or create balance for currency
      let balance = await manager.findOne(WalletBalance, {
        where: {
          wallet: { id: user.wallet.id },
          currencyCode,
        },
      });

      //   console.log('Found balance:', balance);

      if (!balance) {
        balance = manager.create(WalletBalance, {
          wallet: user.wallet,
          currencyCode,
          balance: 0,
        });
        // console.log('Created new balance:', balance);
      }

      // Update balance
      const oldBalance = balance.balance;
      balance.balance = Number(balance.balance) + Number(amount);
      await manager.save(balance);

      //   console.log('Updated balance:', {
      //     oldBalance,
      //     newBalance: balance.balance,
      //     currencyCode,
      //     userId
      //   });

      // Log transaction
      const transaction = manager.create(Transaction, {
        wallet: user.wallet,
        user: { id: userId },
        type: TransactionType.FUNDING,
        fromCurrency: currencyCode,
        fromAmount: amount,
        toCurrency: currencyCode,
        toAmount: amount,
        rateUsed: 1,
        status: TransactionStatus.SUCCESS,
      });

      await manager.save(transaction);

      //   console.log('Created transaction:', transaction);
      let wallet = {
        newBalance: balance.balance,
        transactionId: transaction.id,
        currencyCode,
        userId,
      };

      return { wallet };
    });
  }

  async convertCurrency(
    userId: number,
    fromCurrency: string,
    toCurrency: string,
    amount: number,
  ) {
    return this.entityManager.transaction(async (manager) => {
      // Get user's balances
      const [sourceBalance, targetBalance] = await Promise.all([
        manager.findOne(WalletBalance, {
          where: {
            wallet: { user: { id: userId } },
            currencyCode: fromCurrency,
          },
          relations: ['wallet'],
        }),
        manager.findOne(WalletBalance, {
          where: {
            wallet: { user: { id: userId } },
            currencyCode: toCurrency,
          },
          relations: ['wallet'],
        }),
      ]);

      // Validate source balance
      if (!sourceBalance || sourceBalance.balance < amount) {
        console.log('Insufficient balance:', {
          available: sourceBalance?.balance || 0,
          required: amount,
        });
        throw appError(
          `Insufficient ${fromCurrency} balance. ` +
            `Available: ${sourceBalance?.balance || 0}, ` +
            `Required: ${amount}`,
        );
      }

      // Get FX rate
      const rate = await this.exchangeRateService.getConversionRate(
        fromCurrency,
        toCurrency,
      );
      console.log('rate................:', rate);

      // Calculate converted amount
      const convertedAmount = Number((amount * rate).toFixed(4));

      // 5. Update balances
      sourceBalance.balance = Number(
        (Number(sourceBalance.balance) - Number(amount)).toFixed(4),
      );

      if (targetBalance) {
        targetBalance.balance = Number(
          (Number(targetBalance.balance) + Number(convertedAmount)).toFixed(4),
        );
      } else {
        const newBalance = manager.create(WalletBalance, {
          wallet: { user: { id: userId } },
          currencyCode: toCurrency,
          balance: Number(convertedAmount.toFixed(4)),
        });
        await manager.save(newBalance);
      }

      // Save updated balances
      await manager.save(sourceBalance);
      if (targetBalance) await manager.save(targetBalance);

      // 7. Create transaction record
      const transaction = manager.create(Transaction, {
        // wallet: { user: { id: userId } },
        wallet: sourceBalance.wallet,
        user: { id: userId },
        type: TransactionType.CONVERSION,
        fromCurrency,
        fromAmount: amount,
        toCurrency,
        toAmount: convertedAmount,
        rateUsed: rate,
        status: TransactionStatus.SUCCESS,
      });

      //   console.log('Created transaction:', transaction);

      await manager.save(transaction);

      let conversion = {
        fromAmount: amount,
        toAmount: convertedAmount,
        rate,
        newBalances: {
          [fromCurrency]: sourceBalance.balance,
          [toCurrency]: targetBalance?.balance || convertedAmount,
        },
      };
      return { conversion };
    });
  }

  async validateTradeAmount(userId: number, currency: string, amount: number) {
    const balance = await this.entityManager.findOne(WalletBalance, {
      where: {
        wallet: { user: { id: userId } },
        currencyCode: currency,
      },
    });

    if (!balance || balance.balance < amount) {
      throw new Error(`Insufficient ${currency} balance`);
    }
  }

  async executeTrade(
    userId: number,
    fromCurrency: string,
    toCurrency: string,
    amount: number,
  ) {
    try {
      const trade = this.convertCurrency(
        userId,
        fromCurrency,
        toCurrency,
        amount,
      );
      return { trade };
    } catch (error) {
      throw appError(error);
    }
  }

  async getWalletBalances(userId: number) {
    const wallet = await this.entityManager.findOne(Wallet, {
      where: { user: { id: userId } },
      relations: ['balances']
    });
  
    if (!wallet) {
      throw appError('Wallet not found');
    }
  
    return wallet.balances.map(balance => ({
      currencyCode: balance.currencyCode,
      balance: Number(balance.balance)
    }));
  }


}
