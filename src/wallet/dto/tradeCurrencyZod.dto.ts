import { z } from 'zod';
import { SUPPORTED_FOREIGN_CURRENCIES } from '../common/constant/currencies';

const tradeCurrencySchema = z.object({
  direction: z.enum(['NGN_TO_FOREIGN', 'FOREIGN_TO_NGN']),
  foreignCurrency: z.enum(SUPPORTED_FOREIGN_CURRENCIES),
  amount: z.number().positive().min(1)
});

export type TradeCurrencyZodDto = z.infer<typeof tradeCurrencySchema>;