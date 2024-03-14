import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsString, MaxLength } from 'class-validator'

import { IsNullable } from '../../configuration/validation/is-nullable'

export class LabellingDto {
  @ApiProperty()
  @IsNullable()
  storageConditions!: string | null

  @ApiProperty()
  @IsNullable()
  includeAverageWeightOnLabel!: boolean | null

  @ApiProperty()
  @IsNullable()
  @IsString()
  countryOfOriginDescription!: string | null

  @ApiProperty()
  @IsNullable()
  @IsString()
  ean13Code!: string | null

  @ApiProperty()
  @IsNullable()
  useBy!: string | null

  @ApiProperty()
  @IsNullable()
  sellBy!: string | null

  @ApiProperty()
  @IsNullable()
  @IsString()
  @MaxLength(280)
  legalTitle!: string | null

  @ApiProperty()
  howToCard!: {
    qrPng: string
    qrSvg: string
    fileName: string
  }

  @ApiProperty()
  @IsBoolean()
  includeNutritionalInformationOnLabel!: boolean

  @ApiProperty()
  @IsBoolean()
  canBeCookedInTurboChef!: boolean

  @ApiProperty()
  @IsNullable()
  useByTurboChef!: string | null

  @ApiProperty()
  @IsNullable()
  sellByTurboChef!: string | null

  @ApiProperty()
  @IsNullable()
  productServes!: string | null
}
