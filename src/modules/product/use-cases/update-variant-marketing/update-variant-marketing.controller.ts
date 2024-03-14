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
import { VariantVersionControllerParamsSwagger } from '../../../variant-version/variant-version-controller-params'
import { ReviewStatusInterceptor } from '../../logic/review-status/review-status.interceptor'

import { UpdateVariantMarketingDto } from './update-variant-marketing.dto'
import { UpdateVariantMarketingService } from './update-variant-marketing.service'

const UpdateMarketingSwagger = applyDecorators(
  ApiTags(SwaggerApiTag.ProductVariant),
  ApiBearerAuth(),
  HttpCode(HttpStatus.NO_CONTENT),
)

@Controller('/v3/products/:masterSku/variants/:variantSku')
export class UpdateVariantMarketingController {
  constructor(private readonly _updateVariantMarketingService: UpdateVariantMarketingService) {}

  @UseInterceptors(ReviewStatusInterceptor)
  @UpdateMarketingSwagger
  @RequirePermissions(AuthPermission.EDIT_PRODUCT)
  @Put('/marketing')
  async updateVariantMarketing(
    @Param('masterSku') masterSku: string,
    @Param('variantSku') variantSku: string,
    @Body()
    body: UpdateVariantMarketingDto,
  ) {
    await this._updateVariantMarketingService.updateLiveVariant(masterSku, variantSku, body)
  }

  @UseInterceptors(ReviewStatusInterceptor)
  @VariantVersionControllerParamsSwagger
  @RequirePermissions(AuthPermission.EDIT_PRODUCT)
  @Put('/versions/:versionKey/marketing')
  async updateVariantVersionMarketing(
    @Param('masterSku') masterSku: string,
    @Param('variantSku') variantSku: string,
    @Param('versionKey') versionKey: string,
    @Body()
    body: UpdateVariantMarketingDto,
  ) {
    await this._updateVariantMarketingService.updateVariantVersion(
      masterSku,
      variantSku,
      versionKey,
      body,
    )
  }
}
