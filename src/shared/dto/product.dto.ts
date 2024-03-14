// todo add shared dto between draft changes
import { ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { IsBoolean, IsDateString } from 'class-validator'

import { CountryCode } from '../model/country-code'
import { ProductTypeKey } from '../../modules/product-type/product-type-key'

import { MultiLangStringDto } from './multi-lang-string.dto'
import { CategoryListItemDto } from './category-list-item.dto'
import { TaxCategoryDto } from './tax-category.dto'
import { BaristaSetupDto } from './barista-setup.dto'
import { ProductVariantDto } from './product-variant.dto'

export class ProductDto {
  @ApiProperty({
    enum: ProductTypeKey,
  })
  type!: ProductTypeKey

  @ApiProperty({ type: MultiLangStringDto })
  name!: MultiLangStringDto

  @ApiProperty({ type: MultiLangStringDto })
  description!: MultiLangStringDto

  // TODO: Do we need it? Its not translated
  @ApiProperty({
    example: 'France',
    description: 'Country name',
    deprecated: true,
  })
  country!: string

  @ApiProperty({
    enum: CountryCode,
  })
  countryCode!: CountryCode

  @ApiProperty({
    type: 'array',
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          key: {
            type: 'string',
          },
          name: {
            oneOf: [
              {
                $ref: getSchemaPath(MultiLangStringDto),
              },
            ],
          },
        },
      },
    },
  })
  categories!: CategoryListItemDto[][]

  @ApiProperty({
    nullable: true,
    type: () => TaxCategoryDto,
    oneOf: [
      {
        $ref: getSchemaPath(TaxCategoryDto),
      },
    ],
  })
  taxCategory!: null | TaxCategoryDto

  @ApiProperty({
    type: () => BaristaSetupDto,
    nullable: true,
    oneOf: [
      {
        $ref: getSchemaPath(BaristaSetupDto),
      },
    ],
  })
  setUp!: BaristaSetupDto | null

  @ApiProperty({
    type: ProductVariantDto,
    isArray: true,
    name: 'variants',
  })
  variants!: ProductVariantDto[]

  @ApiProperty()
  @IsBoolean()
  published!: boolean

  @IsDateString()
  @ApiProperty()
  createdAt: string | null = null

  @ApiProperty()
  @IsBoolean()
  takeAwayTaxDisabled!: boolean
}
