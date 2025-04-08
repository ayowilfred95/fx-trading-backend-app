import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { ExchangeRate } from '../../src/entities/exchange.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { appError } from 'lib/helpers/error';

@Injectable()
export class ExchangeRateService {
  private readonly logger = new Logger(ExchangeRateService.name);
  private readonly API_URL = 'https://api.exchangerate-api.com/v4/latest/NGN';
  private cachedRates: Record<string, number> = {};

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(ExchangeRate)
    private readonly rateRepo: Repository<ExchangeRate>,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async fetchLatestRates() {
    try {
      const { data } = await firstValueFrom(this.httpService.get(this.API_URL));

      const rates = data.rates;
      const timestamp = new Date();

      // Clear old rates
      await this.rateRepo.clear();

      // Save new rates and build cache
      const rateEntries = await this.rateRepo.manager.transaction(
        async (manager) => {
          const entries = [];

          for (const [currency, rate] of Object.entries(rates)) {
            if (currency === 'NGN') continue;

            const newRate = manager.create(ExchangeRate, {
              baseCurrency: 'NGN',
              targetCurrency: currency,
              rate: Number(rate),
              timestamp,
            });

            await manager.save(newRate);
            entries.push(newRate);
          }

          return entries;
        },
      );

      // Update cache with direct and inverse rates
      this.cachedRates = rateEntries.reduce((acc, rate) => {
        acc[`${rate.baseCurrency}_${rate.targetCurrency}`] = rate.rate;
        acc[`${rate.targetCurrency}_${rate.baseCurrency}`] = 1 / rate.rate;
        return acc;
      }, {});

      this.logger.log('FX rates updated successfully');
    } catch (error) {
      throw appError(error);
    }
  }

  async getConversionRate(
    fromCurrency: string,
    toCurrency: string,
  ): Promise<number> {
    try {
      if (fromCurrency === toCurrency) return 1;
      return this.cachedRates[`${fromCurrency}_${toCurrency}`] || 0;
    } catch (error) {
      throw appError(error);
    }
  }

  getCurrentRates() {
    return {
      rates: this.cachedRates,
      timestamp: new Date().toISOString(),
    };
  }
}
