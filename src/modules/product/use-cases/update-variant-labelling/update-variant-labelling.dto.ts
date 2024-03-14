import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEAN, IsString, MaxLength } from 'class-validator'

import { IsNullable } from '../../../../configuration/validation/is-nullable'

export class UpdateVariantLabellingDto {
  @ApiProperty()
  @IsNullable()
  storageConditions!: string | null

  @ApiProperty()
  @IsBoolean()
  includeAverageWeightOnLabel!: boolean

  @ApiProperty()
  @IsNullable()
  @IsString()
  countryOfOriginDescription!: string | null

  @ApiProperty()
  @IsNullable()
  @IsString()
  @IsEAN()
  ean13Code!: string | null

  @ApiProperty()
  @IsNullable()
  @IsString()
  useBy!: string | null

  @ApiProperty()
  @IsNullable()
  @IsString()
  sellBy!: string | null

  @ApiProperty()
  @IsNullable()
  @IsString()
  @MaxLength(280)
  legalTitle!: string | null

  @ApiProperty()
  @IsBoolean()
  includeNutritionalInformationOnLabel!: boolean

  @ApiProperty()
  @IsBoolean()
  canBeCookedInTurboChef!: boolean

  @ApiProperty()
  @IsNullable()
  @IsString()
  useByTurboChef!: string | null

  @ApiProperty()
  @IsNullable()
  @IsString()
  sellByTurboChef!: string | null

  @ApiProperty()
  @IsNullable()
  @IsString()
  productServes!: string | null
}
