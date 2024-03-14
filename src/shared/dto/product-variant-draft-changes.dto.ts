import { ApiProperty } from '@nestjs/swagger'

import { StatusCount } from '../../modules/product/logic/review-status/models/status-count'
import { VariantReviewStatus } from '../../modules/product/logic/review-status/models/variant-review-status'

import { ProductVariantChangesCountDto } from './product-variant-changes-count.dto'
import { ProductVariantDto } from './product-variant.dto'

export class ProductVariantDraftChangesDto extends ProductVariantDto {
  @ApiProperty({ type: ProductVariantChangesCountDto })
  changesCount!: ProductVariantChangesCountDto

  @ApiProperty({ type: {} })
  reviewStatuses?: VariantReviewStatus & StatusCount
}
