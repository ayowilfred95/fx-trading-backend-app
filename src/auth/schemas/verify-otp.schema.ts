import { z } from 'zod';

export const verifyOtpSchema = z.object({
  otp: z.string().max(6, 'OTP must be at most 6 characters'),
});

export type VerifyOtpDto = z.infer<typeof verifyOtpSchema>;
