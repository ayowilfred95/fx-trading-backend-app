import { z } from 'zod';

import { SUPPORTED_CURRENCIES } from '../common/constant/currencies';

const convertCurrencySchema = z.object({
  fromCurrency: z.enum(SUPPORTED_CURRENCIES),
  toCurrency: z.enum(SUPPORTED_CURRENCIES),
  amount: z.number().positive().min(1)
});

export type ConvertCurrencyDto = z.infer<typeof convertCurrencySchema>