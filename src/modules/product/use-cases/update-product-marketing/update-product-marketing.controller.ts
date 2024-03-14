import { applyDecorators, Body, Controller, HttpCode, HttpStatus, Param, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { SwaggerApiTag } from '../../../../shared/swagger-api-tag'
import { RequirePermissions } from '../../../auth/has-permission.guard'
import { AuthPermission } from '../../../auth/auth-permission'

import { UpdateProductMarketingDto } from './update-product-marketing.dto'
import { UpdateProductMarketingService } from './update-product-marketing.service'

const UpdateMarketingSwagger = applyDecorators(
  ApiTags(SwaggerApiTag.ProductGroup),
  ApiBearerAuth(),
  HttpCode(HttpStatus.NO_CONTENT),
)

@Controller('/v3/products')
export class UpdateProductMarketingController {
  constructor(private readonly _updateProductMarketing: UpdateProductMarketingService) {}

  @UpdateMarketingSwagger
  @RequirePermissions(AuthPermission.EDIT_PRODUCT)
  @Put('/:masterSku/marketing')
  async updateMarketing(@Param('masterSku') sku: string, @Body() body: UpdateProductMarketingDto) {
    return this._updateProductMarketing.update(sku, body)
  }
}
