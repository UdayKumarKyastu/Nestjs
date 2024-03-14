import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class BaristaAttributesDto {
  @IsBoolean()
  @ApiProperty()
  withDecafPods!: boolean

  @IsBoolean()
  @ApiProperty()
  withoutMilk!: boolean

  @IsBoolean()
  @ApiProperty()
  withSemiSkimmedMilk!: boolean

  @IsBoolean()
  @ApiProperty()
  withSkimmedMilk!: boolean

  @IsBoolean()
  @ApiProperty()
  withOatMilk!: boolean

  @IsBoolean()
  @ApiProperty()
  withRiceCoconutMilk!: boolean

  @IsBoolean()
  @ApiProperty()
  withSoyMilk!: boolean
}
