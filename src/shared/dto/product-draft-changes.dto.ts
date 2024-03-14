import { ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { IsBoolean, IsDateString } from 'class-validator'

import { StatusCount } from '../../modules/product/logic/review-status/models/status-count'
import { ProductReviewStatus } from '../../modules/product/logic/review-status/models/product-review-status'

import { ProductVariantDraftChangesDto } from './product-variant-draft-changes.dto'
import { MultiLangStringDto } from './multi-lang-string.dto'
import { CategoryListItemDto } from './category-list-item.dto'
import { BaristaSetupDto } from './barista-setup.dto'
import { ProductChangesCountDto } from './product-changes-count.dto'

export class ProductDraftChangesDto {
  @ApiProperty({ type: MultiLangStringDto })
  name!: MultiLangStringDto

  @ApiProperty({ type: MultiLangStringDto })
  description!: MultiLangStringDto

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  lastEdit!: string

  @ApiProperty({
    type: 'object',
    nullable: true,
  })
  reviewStatuses?: ProductReviewStatus & StatusCount

  @ApiProperty({
    nullable: true,
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
    },
  })
  taxCategory!: null | {
    id: string
  }

  @ApiProperty({
    type: ProductVariantDraftChangesDto,
    isArray: true,
  })
  variants!: ProductVariantDraftChangesDto[]

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

  @ApiProperty({ type: ProductChangesCountDto })
  changesCount!: ProductChangesCountDto

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

  @ApiProperty()
  @IsBoolean()
  published!: boolean

  @IsDateString()
  @ApiProperty()
  createdAt: string | null = null
}
