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

import { AuthPermission } from '../../../auth/auth-permission'
import { RequirePermissions } from '../../../auth/has-permission.guard'
import { SwaggerApiTag } from '../../../../shared/swagger-api-tag'
import {
  VariantVersionControllerParams,
  VariantVersionControllerParamsSwagger,
} from '../../../variant-version/variant-version-controller-params'
import { ReviewStatusInterceptor } from '../../logic/review-status/review-status.interceptor'

import { UpdateVariantPricingDto } from './update-variant-pricing.dto'
import { UpdateVariantPricingService } from './update-variant-pricing.service'

const UpdatePricingSwagger = applyDecorators(
  ApiTags(SwaggerApiTag.ProductVariant),
  ApiBearerAuth(),
  HttpCode(HttpStatus.NO_CONTENT),
)

@Controller('/v3/products/:masterSku/variants/:variantSku')
export class UpdateVariantPricingController {
  constructor(private readonly _updateVariantPricingService: UpdateVariantPricingService) {}

  @UseInterceptors(ReviewStatusInterceptor)
  @UpdatePricingSwagger
  @RequirePermissions(AuthPermission.EDIT_PRODUCT)
  @Put('/pricing')
  async updateVariantPricing(
    @Param('masterSku') masterSku: string,
    @Param('variantSku') variantSku: string,
    @Body() body: UpdateVariantPricingDto,
  ) {
    await this._updateVariantPricingService.updateVariant(masterSku, variantSku, body)
  }

  @UseInterceptors(ReviewStatusInterceptor)
  @VariantVersionControllerParamsSwagger
  @RequirePermissions(AuthPermission.EDIT_PRODUCT)
  @Put('/versions/:versionKey/pricing')
  async updateVariantVersionPricing(
    @Param() params: VariantVersionControllerParams,
    @Body() body: UpdateVariantPricingDto,
  ) {
    await this._updateVariantPricingService.updateVersion(
      params.masterSku,
      params.variantSku,
      params.versionKey,
      body,
    )
  }
}
