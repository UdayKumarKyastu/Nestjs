import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsDateString,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

import { MultiLangStringDto } from '../../../../shared/dto/multi-lang-string.dto'
import { AvailabilityDto } from '../../../../shared/dto/availability.dto'

namespace Time {
  export type IsoDateTimeString = string
  export type StringDate = string
  export const buildStringDate = (dateString: IsoDateTimeString | null) => {
    if (!dateString) return null
    const date = new Date(dateString)

    return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`
  }
}

class DisplayAsNewDto {
  @IsBoolean()
  @ApiProperty()
  isDisplayed!: boolean

  @IsDateString()
  @IsOptional()
  @ApiProperty({ example: '2021-05-25T00:00:00.000Z' })
  until: Time.IsoDateTimeString | null = null
}

export class UpdateVariantMarketingDto {
  @IsNotEmptyObject()
  @ApiProperty()
  @ValidateNested()
  @Type(() => MultiLangStringDto)
  name!: MultiLangStringDto

  @IsNotEmptyObject()
  @ApiProperty()
  @ValidateNested()
  @Type(() => MultiLangStringDto)
  description!: MultiLangStringDto

  @ApiProperty()
  @IsBoolean()
  availableForClickAndCollect!: boolean

  @ApiProperty()
  @IsBoolean()
  availableForPretDelivers!: boolean

  @ApiProperty()
  @IsBoolean()
  availableForOutposts!: boolean

  @ApiProperty()
  @IsBoolean()
  isLive!: boolean

  @ApiProperty()
  @IsBoolean()
  visibleOnDeliveryWebsite!: boolean

  @ApiProperty()
  @IsBoolean()
  isChefsSpecial!: boolean

  @IsNotEmptyObject()
  @ApiProperty()
  @ValidateNested()
  @Type(() => DisplayAsNewDto)
  displayAsNew!: AvailabilityDto['displayAsNew']

  @ApiProperty()
  @IsString({
    each: true,
  })
  howToDisplay!: string[]

  @ApiProperty()
  @IsBoolean()
  availableForLunch!: boolean

  @ApiProperty()
  @IsBoolean()
  availableAllDay!: boolean
}
