import { ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { IsBoolean, IsDateString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { IsNullable } from '../../configuration/validation/is-nullable'
import { DisplayAsNotNew, DisplayedAsNew } from '../model/display-as-new'

export class LiveScheduleDTO {
  @IsDateString()
  @IsNullable()
  on!: string | null

  @IsDateString()
  @IsNullable()
  off!: null | string
}

export class AvailabilityDto {
  @IsBoolean()
  @ApiProperty()
  isLive!: boolean

  @IsBoolean()
  @ApiProperty()
  visibleOnDeliveryWebsite!: boolean

  @IsBoolean()
  @ApiProperty()
  availableForPretDelivers!: boolean

  @IsBoolean()
  @ApiProperty()
  availableForClickAndCollect!: boolean

  @IsBoolean()
  @ApiProperty()
  availableForOutposts!: boolean

  @IsBoolean()
  @ApiProperty()
  isChefsSpecial!: boolean

  /**
   * TODO Add custom validator for union
   * https://github.com/typestack/class-validator#custom-validation-classes
   */
  @ValidateNested()
  @ApiProperty({
    oneOf: [
      {
        $ref: getSchemaPath(DisplayedAsNew),
      },
      {
        $ref: getSchemaPath(DisplayAsNotNew),
      },
    ],
  })
  displayAsNew!: DisplayedAsNew | DisplayAsNotNew

  @ApiProperty({
    type: LiveScheduleDTO,
  })
  @ValidateNested()
  @Type(() => LiveScheduleDTO)
  liveSchedule!: LiveScheduleDTO

  @ApiProperty()
  availableForLunch!: boolean

  @ApiProperty()
  availableAllDay!: boolean
}
