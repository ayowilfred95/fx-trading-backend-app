
export const SUPPORTED_CURRENCIES = ['NGN', 'USD', 'EUR', 'GBP'] as const;
export const SUPPORTED_FOREIGN_CURRENCIES = 
  SUPPORTED_CURRENCIES.filter(c => c !== 'NGN') as ['USD', 'EUR', 'GBP'];