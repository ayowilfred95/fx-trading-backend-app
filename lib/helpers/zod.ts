import { ZodError, ZodSchema } from 'zod';
import { Injectable, BadRequestException } from '@nestjs/common';
@Injectable()
export class ValidationService {
  validateSchema(schema: ZodSchema, data: any): void {
    const parsed = schema.safeParse(data);
    
    if (!parsed.success) {
      const errorMessages = this.formatZodErrors(parsed.error);
      throw new BadRequestException(`Invalid input data: ${errorMessages}`);
    }
  }

  private formatZodErrors(error: ZodError): string {
    return Object.values(error.formErrors.fieldErrors)
      .flat()
      .join(', ');
  }
}