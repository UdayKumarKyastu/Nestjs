import {
  applyDecorators,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { SwaggerApiTag } from '../../../../shared/swagger-api-tag'
import { RequirePermissions } from '../../../auth/has-permission.guard'
import { AuthPermission } from '../../../auth/auth-permission'
import { ReviewStatusInterceptor } from '../../logic/review-status/review-status.interceptor'

import { UpdateProductCategoryService } from './update-product-category.service'
import { UpdateProductCategoryDto } from './update-product-category.dto'

const UpdateCategorySwagger = applyDecorators(
  ApiTags(SwaggerApiTag.ProductGroup, SwaggerApiTag.Categories),
  ApiBearerAuth(),
  HttpCode(HttpStatus.NO_CONTENT),
)

@Controller('/v3/products')
export class UpdateProductCategoryController {
  constructor(private readonly _updateProductCategoryService: UpdateProductCategoryService) {}

  @UseInterceptors(ReviewStatusInterceptor)
  @RequirePermissions(AuthPermission.EDIT_PRODUCT)
  @UpdateCategorySwagger
  @Put('/:masterSku/categories')
  async updateTaxation(@Param('masterSku') sku: string, @Body() body: UpdateProductCategoryDto) {
    return this._updateProductCategoryService.update(sku, body)
  }
}
