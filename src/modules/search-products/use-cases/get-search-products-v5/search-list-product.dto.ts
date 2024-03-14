import { ApiProperty } from '@nestjs/swagger'

import { MultiLangStringDto } from '../../../../shared/dto/multi-lang-string.dto'

class BaseMeta {
  @ApiProperty({
    type: MultiLangStringDto,
  })
  name!: MultiLangStringDto

  @ApiProperty({
    type: MultiLangStringDto,
  })
  description!: MultiLangStringDto

  @ApiProperty()
  sku!: string

  @ApiProperty()
  createdAt!: string
}

export class SearchListProductVariant extends BaseMeta {
  @ApiProperty()
  isMaster!: boolean

  @ApiProperty({
    nullable: true,
    type: 'string',
    example: '12345',
  })
  hgCode!: string | null

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  imageUrl!: string | null

  @ApiProperty({
    type: 'string',
  })
  createdAt!: string

  @ApiProperty({
    type: 'string',
  })
  countryCode!: string

  @ApiProperty({
    type: 'boolean',
  })
  published!: boolean

  @ApiProperty({
    type: 'boolean',
  })
  visibleOnWebsite!: boolean
}

export class SearchListProductDto extends BaseMeta {
  @ApiProperty({
    type: SearchListProductVariant,
    isArray: true,
  })
  variants!: SearchListProductVariant[]
}

export class SearchProductsListDto {
  @ApiProperty({
    type: SearchListProductDto,
    isArray: true,
  })
  products!: SearchListProductDto[]

  @ApiProperty()
  total!: number
}
