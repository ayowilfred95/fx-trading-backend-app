// src/wallet/wallet.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { Role } from '../../src/auth/enums/role.enum';
import { AuthenticatedRequest } from '../../src/common/types/authenticated-request';
import { Response } from 'express';
import { appError } from '../../lib/helpers/error';

describe('WalletController', () => {
  let walletController: WalletController;
  let walletService: WalletService;

  const mockWalletService = {
    getWalletBalances: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [
        {
          provide: WalletService,
          useValue: mockWalletService,
        },
      ],
    }).compile();

    walletController = module.get<WalletController>(WalletController);
    walletService = module.get<WalletService>(WalletService);
  });

  describe('getWalletBalances', () => {
    const mockRequest = {
      user: {
        id: 1,
        role: Role.USER,
      },
    } as AuthenticatedRequest;

    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    it('should return wallet balances successfully', async () => {
      const mockBalances = [
        { currencyCode: 'NGN', balance: 10000 },
        { currencyCode: 'USD', balance: 500 },
      ];

      mockWalletService.getWalletBalances.mockResolvedValue(mockBalances);

      await walletController.getWalletBalances(mockRequest, mockResponse);

      expect(mockWalletService.getWalletBalances).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: { balances: mockBalances },
        message: 'Wallet balances retrieved successfully',
      });
    });

    it('should handle errors gracefully', async () => {
      const error =  appError('Test error');
      mockWalletService.getWalletBalances.mockRejectedValue(error);

      await walletController.getWalletBalances(mockRequest, mockResponse);

      expect(mockWalletService.getWalletBalances).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Test error',
      });
    });
  });
});