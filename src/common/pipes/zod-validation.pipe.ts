import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any) {
    console.log('Inside ZodValidationPipe:', value);
    const result = this.schema.safeParse(value);
    if (!result.success) {
      console.log('Zod Validation Errors......:', result.error.errors);
      throw new BadRequestException(result.error.format());
    }
    return result.data;
  }
}
