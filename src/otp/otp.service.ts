import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from '../entities/otp.entity'; // Otp entity
import { authenticator, totp } from 'otplib'; // OTP library
import { appError, notFoundError } from 'lib/helpers/error';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
  ) {}

  // Method to generate OTP
  async generateOtp(userId: number) {
    try {
      const secret = authenticator.generateSecret();
      let otp = totp.generate(secret);

      otp = otp.substring(0, 6);

      const expirationTimeInSeconds = 2000;
      const expiresAt = new Date(Date.now() + expirationTimeInSeconds * 1000);

      const otpRecord = this.otpRepository.create({
        userId,
        otp,
        expiresAt,
      });

      // Save OTP to the database
      await this.otpRepository.save(otpRecord);

      return { otp: otpRecord };
    } catch (error) {
      throw appError(error.message);
    }
  }

  // Method to verify OTP
  async verifyOtp(otp: string, userId: number) {
    try {
      const otpRecord = await this.otpRepository.findOne({
        where: { userId, otp },
      });

      if (!otpRecord) {
        throw appError('OTP record not found for user');
      }

      const { otp: storedOtp, expiresAt } = otpRecord;

      // Validate OTP
      const isValid = String(otp).trim() === String(storedOtp).trim();

      if (!isValid) {
        throw notFoundError('OTP is invalid or expired');
      }

      // Check if OTP has expired
      if (new Date() > new Date(otpRecord.expiresAt)) {
        await this.otpRepository.delete(otpRecord.id);
        throw appError('OTP has expired');
      }

      return { isValid: true,otpRecord:otpRecord.id };
    } catch (error) {
      throw appError(error.message);
    }
  }

  async deleteOtp(id: number) {
    try {
      const result = await this.otpRepository.delete(id);
      if (result.affected !== 0) {
        return true;
      }
      return false;
    } catch (error) {
      throw appError(error);
    }
  }
}
