import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

import { SubscriptionStatus } from '../models/subscription-status'

export class Subscription {
  @ApiProperty()
  @IsString()
  id!: string

  @ApiProperty()
  @IsNumber()
  start_date?: number

  @ApiProperty()
  @IsNumber()
  current_term_start?: number

  @ApiProperty()
  @IsNumber()
  current_term_end?: number

  @ApiProperty()
  @IsNumber()
  next_billing_at?: number

  @ApiProperty()
  @IsNumber()
  created_at?: number

  @ApiProperty()
  @IsNumber()
  started_at?: number

  @ApiProperty()
  status!: SubscriptionStatus

  @ApiProperty()
  @IsNumber()
  activated_at?: number

  @ApiProperty()
  @IsString()
  plan_name!: string

  @ApiProperty()
  preferred_state!: string | null
}
