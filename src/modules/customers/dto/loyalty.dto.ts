import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

import { RewardDto } from './reward.dto'

export class LoyaltyDto {
  @ApiProperty()
  @IsNumber()
  totalNoOfStars!: number

  @ApiProperty()
  @IsNumber()
  starsLeftToReward!: number

  @ApiProperty({ type: RewardDto })
  rewards!: RewardDto[]
}
