import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { apiResponse } from 'lib/helpers/app';
import { TransactionService } from './transaction.service';
import { Response } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { TransactionQueryDto } from './dto/transaction-query.dto';

@Roles(Role.USER)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async getTransactions(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Query() query: TransactionQueryDto,
  ) {
    try {
      const { results, total } =
        await this.transactionService.getUserTransactions(
          req.user.id,
          query.page,
          query.limit,
          query.type ,
        );

      const totalPages = Math.ceil(total / query.limit);

      return apiResponse(res, {
        success: true,
        message: 'Transactions retrieved successfully',
        data: {
          transactions: results,
          pagination: {
            total,
            page: query.page,
            limit: query.limit,
            totalPages: totalPages ? totalPages : 1,
          },
        },
      });
    } catch (error) {
      return apiResponse(res, {
        success: false,
        error: error.message,
      });
    }
  }
}
