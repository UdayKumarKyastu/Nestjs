import { IsBoolean, IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

import { MultiLangStringDto } from '../../../../../shared/dto/multi-lang-string.dto'
import { CountryCode } from '../../../../../shared/model/country-code'
import { IsNullable } from '../../../../../configuration/validation/is-nullable'

class BaseMeta {
  @ApiProperty()
  name!: MultiLangStringDto

  @ApiProperty({
    enum: CountryCode,
  })
  @IsEnum(CountryCode)
  countryCode!: CountryCode

  @ApiProperty()
  @IsString()
  @IsNullable()
  imageUrl!: string | null
}

class VariantVersion extends BaseMeta {
  @ApiProperty()
  @IsBoolean()
  isMaster!: boolean

  @ApiProperty()
  @IsString()
  @IsNullable()
  recipeID!: string | null

  @ApiProperty()
  @IsString()
  sku!: string

  @ApiProperty()
  @IsNumber()
  versionNumber!: number

  @ApiProperty()
  @IsString()
  createdAt!: string
}

class Variant extends BaseMeta {
  @ApiProperty()
  @IsBoolean()
  isMaster!: boolean

  @ApiProperty()
  @IsString()
  @IsNullable()
  recipeID!: string | null

  @ApiProperty()
  @IsString()
  sku!: string

  @ApiProperty()
  @IsString()
  masterSku!: string

  @ApiProperty()
  @IsString()
  createdAt!: string

  @ValidateNested({
    each: true,
  })
  @Type(() => VariantVersion)
  versions!: VariantVersion[]
}

class ProductGroup extends BaseMeta {
  @ValidateNested({
    each: true,
  })
  @Type(() => Variant)
  variants!: Variant[]
}

export class GetNewProductsDto {
  @ApiProperty({
    isArray: true,
    type: ProductGroup,
  })
  @Type(() => ProductGroup)
  @ValidateNested({ each: true })
  productGroups!: ProductGroup[]
}
