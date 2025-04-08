import { z } from 'zod';
import { SUPPORTED_CURRENCIES } from '../common/constant/currencies';
export const createPropertySchema = z
  .object({
    amount: z.number().positive().min(100),
    currencyCode: z.enum(SUPPORTED_CURRENCIES)
  })
  .required();


export type FundWalletZodDto = z.infer<typeof createPropertySchema>;