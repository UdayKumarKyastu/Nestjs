import { applyDecorators, Controller, Get, Param } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'

import { SwaggerApiTag } from '../../../../shared/swagger-api-tag'

import { GetProductCategoriesDto } from './get-product-categories.dto'
import { GetProductCategoriesService } from './get-product-categories.service'

const GetProductCategoriesSwagger = applyDecorators(
  ApiTags(SwaggerApiTag.ProductGroup, SwaggerApiTag.Categories),
  ApiResponse({
    status: 200,
    type: GetProductCategoriesDto,
  }),
  ApiResponse({
    status: 404,
  }),
  ApiBearerAuth(),
)

@Controller('/v3/products')
export class GetProductCategoriesController {
  constructor(private readonly _getProductCategoriesService: GetProductCategoriesService) {}

  @GetProductCategoriesSwagger
  @Get('/:masterSku/categories')
  async getProductCategories(@Param('masterSku') sku: string): Promise<GetProductCategoriesDto> {
    return this._getProductCategoriesService.getProductAvailableCategoriesTree(sku)
  }
}
