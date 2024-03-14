import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsObject, IsString } from 'class-validator'

export class GoodSearchResultDto {
  @IsNumber()
  @ApiProperty()
  id!: string | null

  @IsNumber()
  @ApiProperty()
  hgGoodId!: string | null

  @IsString()
  @ApiProperty()
  name!: string

  @IsString()
  @ApiProperty()
  modifiedAt!: string
}
export class GoodsDto {
  @IsNumber()
  @ApiProperty()
  id!: number

  @IsString()
  @ApiProperty()
  name!: string

  @IsNumber()
  @ApiProperty()
  quantity!: number

  @IsString()
  @ApiProperty()
  unitOfMeasurement!: string

  @IsObject()
  @ApiProperty()
  cost!: {
    centAmount: string
    currencyCode: string
  }

  @IsString()
  @ApiProperty()
  modifiedAt!: string
}
