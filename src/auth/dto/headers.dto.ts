import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class HeadersDto {
  @IsString()
  @Expose({ name: 'authorization' })
  authorization: string;
}