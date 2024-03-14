import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class RewardDto {
  @ApiProperty()
  @IsString()
  name!: string

  @ApiProperty()
  @IsNumber()
  accountId!: number

  @ApiProperty()
  @IsNumber()
  campaignId!: number

  @ApiProperty()
  @IsString()
  status!: string

  @ApiProperty()
  @IsString()
  dateIssued!: string

  @ApiProperty()
  @IsString()
  expiryDate!: string

  @ApiProperty()
  @IsString()
  dateRedeemed!: string
}
