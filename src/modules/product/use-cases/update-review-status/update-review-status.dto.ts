import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional } from 'class-validator'

export class PricingFieldValue {
  @ApiProperty()
  channelName!: string

  @ApiProperty()
  field!:
    | 'takeAwayPrice'
    | 'eatInPrice'
    | 'deliveryPrice'
    | 'eatInTax'
    | 'deliveryTax'
    | 'takeAwayClubPret'
    | 'eatInClubPret'
}

export class UpdateReviewStatusDto {
  @ApiProperty()
  @IsString()
  fieldName!: string

  @ApiProperty()
  @IsString()
  operationType!: 'approve' | 'reject' | 'reset'

  @ApiProperty()
  @IsOptional()
  fieldValue?: string[] | PricingFieldValue
}
