import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsOptional, IsString } from 'class-validator'
import { String } from 'lodash'

import { IsNullable } from '../../../../configuration/validation/is-nullable'

export class UpdateReportingDto {
  @ApiProperty({
    nullable: true,
  })
  @IsString()
  @IsNullable()
  pluReportingName!: string | null

  @ApiProperty({ nullable: true })
  @IsString()
  @IsNullable()
  pluPrimaryCategoryID!: string | null

  @ApiProperty({ nullable: true })
  @IsString()
  @IsNullable()
  pluSecondaryCategoryID!: string | null

  @ApiProperty({ nullable: true })
  @IsString()
  @IsNullable()
  starKisProductCategoryID!: string | null

  @ApiProperty({ nullable: true })
  @IsString()
  @IsNullable()
  starKisProductSubCategoryID!: string | null

  @ApiProperty({ nullable: true, description: 'Only for FOOD product type' })
  @IsString()
  @IsNullable()
  @IsOptional()
  parentProductSku!: string | null

  @ApiProperty({ nullable: true })
  @IsArray()
  @IsNullable()
  productRange!: string[]
}
