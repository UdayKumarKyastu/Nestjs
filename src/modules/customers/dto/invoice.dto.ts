import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

import { InvoiceStatus } from '../models/invoice-status'

export class Invoice {
  @ApiProperty()
  @IsString()
  id!: string

  @ApiProperty()
  @IsNumber()
  paid_at?: number

  @ApiProperty()
  @IsNumber()
  transaction_id?: string

  @ApiProperty()
  @IsNumber()
  amount_paid?: number

  @ApiProperty()
  @IsNumber()
  amount_refunded?: number

  @ApiProperty()
  status!: InvoiceStatus

  @ApiProperty()
  @IsString()
  currency_code!: string

  @ApiProperty()
  @IsNumber()
  updated_at?: number
}
