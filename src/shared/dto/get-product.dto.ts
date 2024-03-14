import { ApiProperty } from '@nestjs/swagger'
import { IsInt, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { TaxCategoryDto } from './tax-category.dto'
import { ProductDraftChangesDto } from './product-draft-changes.dto'
import { ProductDto } from './product.dto'

/**
 * TODO: Add class validator, so backend has validated response
 */
export class GetProductDto {
  @ValidateNested()
  @Type(() => ProductDto)
  @ApiProperty({
    type: ProductDto,
  })
  product!: ProductDto

  @IsInt()
  @ApiProperty()
  version!: number

  @ValidateNested({
    each: true,
  })
  @Type(() => TaxCategoryDto)
  @ApiProperty({
    type: TaxCategoryDto,
    isArray: true,
    deprecated: true,
  })
  taxCategories!: TaxCategoryDto[]

  @Type(() => ProductDraftChangesDto)
  @ValidateNested()
  @ApiProperty({
    type: ProductDraftChangesDto,
  })
  draftChanges!: ProductDraftChangesDto
}
