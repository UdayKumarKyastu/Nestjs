import { applyDecorators, Controller, Get, Param } from '@nestjs/common'
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

import { GetProductDto } from '../../../../shared/dto/get-product.dto'
import { ProductService } from '../../logic/product.service'
import { TaxCategoriesService } from '../../../product-taxation/tax-categories.service'
import { SwaggerApiTag } from '../../../../shared/swagger-api-tag'
import { ProductDraftChangesService } from '../../logic/product-draft-changes.service'
import { ReviewStatusService } from '../../logic/review-status/review-status.service'
import { DIFF_TYPES } from '../../logic/review-status/models/diff-types'
import { ReviewStatusCounter } from '../../logic/review-status/review-status-counter/review-status-counter'

const GetProductSwagger = applyDecorators(
  ApiTags(SwaggerApiTag.ProductGroup),
  ApiParam({
    name: 'sku',
    description: 'SKU for product group, which equals to master SKU',
    example: 'UK12345',
    type: 'string',
    required: true,
  }),
  ApiBearerAuth(),
  ApiResponse({
    status: 200,
    type: GetProductDto,
    description: 'Returns entire product group with its variants',
  }),
  ApiResponse({
    status: 404,
    description: 'No product found',
  }),
)

@Controller('/v3/products')
export class GetProductController {
  constructor(
    private readonly _productService: ProductService,
    private readonly _draftProductService: ProductDraftChangesService,
    private readonly _taxCategoriesService: TaxCategoriesService,
    private readonly _reviewStatusService: ReviewStatusService,
  ) {}

  /**
   * TODO: Refactor - move remaining logic to service
   */
  @GetProductSwagger
  @Get('/:sku')
  async getBySku(@Param('sku') sku: string): Promise<GetProductDto> {
    const productProjection = await this._productService.findOneBySku(sku)
    const productDto = await this._productService.mapProjectionToProductDto(productProjection)

    const availableTaxCategories = await this._taxCategoriesService.findAll({
      /**
       * Currently tax categories are assigned as GB and products are UK
       * https://github.com/pretamanger/website-infrastructure/blob/master/modules/commercetools_platform/tax.tf
       *
       * TODO Unify CT schema
       */
      filterByCountry: productDto.countryCode === 'UK' ? ['UK', 'GB'] : [productDto.countryCode],
    })

    const draftChanges = await this._draftProductService.getProductDraftChanges(sku, productDto)

    const reviewStatusesForProduct = await this._reviewStatusService.getFieldReviewStatuses(
      sku,
      DIFF_TYPES.product,
      undefined,
      productProjection.hasStagedChanges,
    )

    const reviewStatusesForVariants = await Promise.all(
      draftChanges.variants.map((variant) =>
        this._reviewStatusService.getFieldReviewStatuses(
          variant.sku,
          DIFF_TYPES.variant,
          undefined,
          productProjection.hasStagedChanges,
        ),
      ),
    )

    draftChanges.variants = draftChanges.variants.map((draftVariant) => {
      const reviewStatuses = reviewStatusesForVariants.find(
        (status) => status?.sku === draftVariant.sku,
      )

      const variantReviewStatus = reviewStatuses
        ? {
            ...reviewStatuses,
            statusCount: ReviewStatusCounter.countVariantStatuses(reviewStatuses),
          }
        : null

      return {
        ...draftVariant,
        versions: productDto.variants.find((v) => v.sku === draftVariant.sku)?.versions || [],
        reviewStatuses: variantReviewStatus,
      }
    })

    const productReviewStatus = reviewStatusesForProduct
      ? {
          ...reviewStatusesForProduct,
          statusCount: ReviewStatusCounter.countProductStatuses(reviewStatusesForProduct),
        }
      : null

    const dto: GetProductDto = {
      product: productDto,
      taxCategories: availableTaxCategories,
      draftChanges: {
        ...draftChanges,
        reviewStatuses: productReviewStatus,
      },
      version: productProjection.version,
    }

    return dto
  }
}
