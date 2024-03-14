import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class RecipeDto {
  @IsString()
  @ApiProperty()
  id!: string

  @IsNumber()
  @ApiProperty()
  starkisId!: number

  @IsString()
  @ApiProperty()
  name!: string

  @IsString()
  @ApiProperty()
  sku!: string | null

  @IsString()
  @ApiProperty()
  modifiedAt!: string

  @IsString()
  @ApiProperty()
  country!: string | null
}
