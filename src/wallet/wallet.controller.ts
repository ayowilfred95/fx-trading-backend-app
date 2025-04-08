import {
  Controller,
  Post,
  Body,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth/jwt-auth.guard';
import { WalletService } from './wallet.service';
import { apiResponse } from 'lib/helpers/app';
import { Response } from 'express';
import { AuthenticatedRequest } from '../../src/common/types/authenticated-request';
import { FundWalletZodDto } from './dto/fundWalletZod.dto';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { ConvertCurrencyDto } from './dto/convertCurrencyZod.dto';
import { TradeCurrencyZodDto } from './dto/tradeCurrencyZod.dto';

@Roles(Role.USER)
@Controller('wallet')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('fund')
  async fundWallet(
    @Body() fundDto: FundWalletZodDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ) {
    try {
      const response = await this.walletService.fundWallet(
        req.user.id,
        fundDto.amount,
        fundDto.currencyCode,
      );

      return apiResponse(res, {
        success: true,
        data: response,
        message: 'Wallet funded successfully',
      });
    } catch (error) {
      return apiResponse(res, {
        success: false,
        error: error.message,
      });
    }
  }

  @Post('convert')
  async convertCurrency(
    @Body() convertCurrencyDto: ConvertCurrencyDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ) {
    try {
      const response = await this.walletService.convertCurrency(
        req.user.id,
        convertCurrencyDto.fromCurrency,
        convertCurrencyDto.toCurrency,
        convertCurrencyDto.amount,
      );
      return apiResponse(res, {
        success: true,
        data: response,
        message: 'Currency converted successfully',
      });
    } catch (error) {
      return apiResponse(res, {
        success: false,
        error: error.message,
      });
    }
  }

  @Post('trade')
  async tradeCurrency(
    @Body() tradeDto: TradeCurrencyZodDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ) {
    try {
      // Determine conversion direction
      const isSellingNGN = tradeDto.direction === 'NGN_TO_FOREIGN';

      const result = await this.walletService.convertCurrency(
        req.user.id,
        isSellingNGN ? 'NGN' : tradeDto.foreignCurrency,
        isSellingNGN ? tradeDto.foreignCurrency : 'NGN',
        tradeDto.amount,
      );

      const trade = {
        sold: {
          currency: isSellingNGN ? 'NGN' : tradeDto.foreignCurrency,
          amount: result.conversion.fromAmount,
        },
        bought: {
          currency: isSellingNGN ? tradeDto.foreignCurrency : 'NGN',
          amount: result.conversion.toAmount,
        },
        rateUsed: result.conversion.rate,
        newBalances: result.conversion.newBalances,
      };
      const response = {
        trade,
      };

      return apiResponse(res, {
        success: true,
        data: response,
        message: 'Currency trade executed successfully',
      });
    } catch (error) {
      return apiResponse(res, {
        success: false,
        error: error.message,
      });
    }
  }
}
