import { applyDecorators, Body, Controller, HttpCode, HttpStatus, Param, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { SwaggerApiTag } from '../../../../shared/swagger-api-tag'
import { RequirePermissions } from '../../../auth/has-permission.guard'
import { AuthPermission } from '../../../auth/auth-permission'

import { UpdateProductTaxationDto } from './update-product-taxation.dto'
import { UpdateProductTaxationService } from './update-product-taxation.service'

const UpdateTaxationSwagger = applyDecorators(
  ApiTags(SwaggerApiTag.ProductGroup),
  ApiBearerAuth(),
  HttpCode(HttpStatus.NO_CONTENT),
)

@Controller('/v3/products')
export class UpdateProductTaxationController {
  constructor(private readonly _updateTaxationService: UpdateProductTaxationService) {}

  @UpdateTaxationSwagger
  @RequirePermissions(AuthPermission.APPROVE_PRODUCT_CHANGES)
  @Put('/:masterSku/taxation')
  async updateTaxation(@Param('masterSku') sku: string, @Body() body: UpdateProductTaxationDto) {
    return this._updateTaxationService.update(sku, body)
  }
}
