import { Controller, Headers, HttpCode, HttpStatus, Inject, Param, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger'

import { SwaggerApiTag } from '../../shared/swagger-api-tag'
import { RequirePermissions } from '../auth/has-permission.guard'
import { AuthPermission } from '../auth/auth-permission'

import { IProductApprovalService, ProductApprovalService } from './product-approval.service'

@Controller('/v3/products')
export class ProductApprovalController {
  constructor(
    @Inject(ProductApprovalService)
    private readonly _productApprovalService: IProductApprovalService,
  ) {}

  @ApiTags(SwaggerApiTag.ProductGroup)
  @ApiBearerAuth()
  @ApiParam({
    name: 'sku',
    description: 'SKU for product group, which equals to master SKU',
    example: 'UK12345',
    type: 'string',
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(AuthPermission.APPROVE_PRODUCT_CHANGES)
  @Post('/:masterSku/publish')
  async approve(
    @Param('masterSku') masterSku: string,
    @Headers('Authorization') authHeader: string,
  ): Promise<void> {
    return this._productApprovalService.approveDraftChanges(masterSku)
  }

  @ApiTags(SwaggerApiTag.ProductGroup)
  @ApiBearerAuth()
  @ApiParam({
    name: 'sku',
    description: 'SKU for product group, which equals to master SKU',
    example: 'UK12345',
    type: 'string',
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(AuthPermission.APPROVE_PRODUCT_CHANGES)
  @Post('/:masterSku/rejection')
  async reject(@Param('masterSku') masterSku: string): Promise<void> {
    return this._productApprovalService.rejectDraftChanges(masterSku)
  }
}
