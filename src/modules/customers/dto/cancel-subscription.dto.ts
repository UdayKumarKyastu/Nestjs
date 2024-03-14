import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsString } from 'class-validator'

export class CancelSubscriptionDto {
  @ApiProperty()
  @IsBoolean()
  cancelEndOfTerm!: boolean

  @ApiProperty()
  @IsString()
  comment?: string
}
