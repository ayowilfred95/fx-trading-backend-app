import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import {
  getErrorCode,
  getErrorMessage,
  getErrorObject,
  logError,
} from './error.utils';

export const hashGenerate = async (plainText: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(plainText, saltRounds);
};

export const hashCompare = async (plain: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(plain, hash);
};
  
  

export function apiResponse<T>(
  res: Response,
  options: {
    code?: number;
    success: boolean;
    message?: string;
    data?: T;
    error?: unknown;
  },
): Response {
  let { code, success, message, data, error } = options;

  const statusCode =
    code ?? (error == null ? HttpStatus.OK : getErrorCode(error));
  const responseMessage =
    message ?? (error ? getErrorMessage(error) : undefined);
  const responseError = error ? getErrorObject(error) : undefined;

  // If the error is the default error or null, don't include the "error" field
  if (
    responseError &&
    responseError.message === 'An unexpected error occurred'
  ) {
    return res.status(statusCode).json({
      success,
      data,
      ...(responseMessage && { message: responseMessage }),
    });
  }

  if (error) {
    logError(error);
  }

  return res.status(statusCode).json({
    success,
    data,
    error: responseError,
    ...(responseMessage && { message: responseMessage }),
  });
}
