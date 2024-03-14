import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

import { BaristaAttributesDto } from '../../../../shared/dto/barista-attributes.dto'

export class UpdateVariantBaristaAttributesDto extends BaristaAttributesDto {
  @ApiProperty()
  @IsBoolean()
  override withDecafPods!: boolean

  @ApiProperty()
  @IsBoolean()
  override withoutMilk!: boolean

  @ApiProperty()
  @IsBoolean()
  override withSemiSkimmedMilk!: boolean

  @ApiProperty()
  @IsBoolean()
  override withSkimmedMilk!: boolean

  @ApiProperty()
  @IsBoolean()
  override withOatMilk!: boolean

  @ApiProperty()
  @IsBoolean()
  override withRiceCoconutMilk!: boolean

  @ApiProperty()
  @IsBoolean()
  override withSoyMilk!: boolean
}
