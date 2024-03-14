import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class EnumOption {
  @IsString()
  @ApiProperty()
  key!: string

  @IsString()
  @ApiProperty()
  label!: string
}
