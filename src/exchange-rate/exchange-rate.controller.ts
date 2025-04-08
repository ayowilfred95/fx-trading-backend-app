import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ExchangeRateService } from './exchange-rate.service';
import { apiResponse } from 'lib/helpers/app';
import { Response } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request';

@Roles(Role.USER)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('fx')
export class ExchangeRateController {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  @Get('rates')
  async getFxRates(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    try {
      const rates = await this.exchangeRateService.getCurrentRates();

      return apiResponse(res, {
        success: true,
        message: 'FX rates retrieved successfully',
        data: rates,
      });
    } catch (error) {
      return apiResponse(res, {
        success: false,
        error: error.message,
      });
    }
  }
}
