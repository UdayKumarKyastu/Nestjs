import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString, IsOptional } from 'class-validator'

import { RefundReason } from '../models/refund-reason'

export class RefundInvoiceDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  refund_amount!: number

  @ApiProperty()
  @IsOptional()
  reason_code!: RefundReason

  @ApiProperty()
  @IsString()
  @IsOptional()
  comment!: string
}
