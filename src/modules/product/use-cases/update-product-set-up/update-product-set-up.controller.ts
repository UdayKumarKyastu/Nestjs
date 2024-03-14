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

import { UpdateProductSetUpDto } from './update-product-set-up.dto'
import { UpdateProductSetUpService } from './update-product-set-up.service'

const UpdateSetUpSwagger = applyDecorators(
  ApiTags(SwaggerApiTag.ProductGroup),
  ApiBearerAuth(),
  HttpCode(HttpStatus.NO_CONTENT),
)

@Controller('/v3/products')
export class UpdateProductSetUpController {
  constructor(private readonly _updateProductSetUpService: UpdateProductSetUpService) {}

  @UseInterceptors(ReviewStatusInterceptor)
  @UpdateSetUpSwagger
  @RequirePermissions(AuthPermission.EDIT_PRODUCT)
  @Put('/:masterSku/set-up')
  async updateSetUp(@Param('masterSku') sku: string, @Body() body: UpdateProductSetUpDto) {
    return this._updateProductSetUpService.update(sku, body)
  }
}
