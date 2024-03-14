import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsDateString, IsNumber, IsString, ValidateNested } from 'class-validator'

import { IsNullable } from '../../configuration/validation/is-nullable'

import { MultiLangStringDto } from './multi-lang-string.dto'

class HamiltonGrantCuisineDto {
  @IsBoolean()
  @ApiProperty()
  isVegan!: boolean

  @IsBoolean()
  @ApiProperty()
  isVegetarian!: boolean
}

export class NutritionItemDto {
  @IsString()
  @ApiProperty()
  name!: string

  @ValidateNested()
  @ApiProperty()
  localisedLabel!: MultiLangStringDto

  @IsNullable()
  @IsNumber()
  @ApiProperty({
    nullable: true,
  })
  per100g!: number | null

  @IsNullable()
  @IsNumber()
  @ApiProperty({ nullable: true })
  perServing!: number | null
}

export class AllergenDto {
  @IsString()
  @ApiProperty()
  name!: string

  @ValidateNested()
  @ApiProperty({
    type: MultiLangStringDto,
  })
  label!: MultiLangStringDto
}

export class HamiltonGrantDto {
  @ValidateNested()
  @ApiProperty({
    type: HamiltonGrantCuisineDto,
  })
  cuisine!: HamiltonGrantCuisineDto

  @IsString()
  @IsNullable()
  @ApiProperty({ nullable: true })
  productCode!: string | null

  @IsNullable()
  @IsDateString()
  @ApiProperty({
    format: 'date-time',
    description: 'ISO string',
    nullable: true,
  })
  lastSyncedAt!: string | null

  @ValidateNested({
    each: true,
  })
  @ApiProperty({
    isArray: true,
    type: NutritionItemDto,
  })
  nutrition!: NutritionItemDto[]

  @ValidateNested({
    each: true,
  })
  @ApiProperty({
    type: AllergenDto,
    isArray: true,
  })
  allergens!: AllergenDto[]

  @ValidateNested()
  @ApiProperty({
    type: MultiLangStringDto,
  })
  ingredients!: MultiLangStringDto

  @ApiProperty({
    isArray: true,
  })
  constituentHGCodes!: string[]

  @IsString()
  @ApiProperty()
  hgRecipeStatus!: string | null

  @ApiProperty({
    isArray: true,
  })
  @ApiProperty()
  recipeTypes!: string[] | null
}
