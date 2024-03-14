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
import {
  VariantVersionControllerParams,
  VariantVersionControllerParamsSwagger,
} from '../../../variant-version/variant-version-controller-params'
import { ReviewStatusInterceptor } from '../../logic/review-status/review-status.interceptor'

import { UpdateVariantBaristaAttributesDto } from './update-variant-barista-attributes.dto'
import { UpdateVariantBaristaAttributesService } from './update-variant-barista-attributes.service'

const UpdateBaristaAttributesSwagger = applyDecorators(
  ApiTags(SwaggerApiTag.ProductVariant),
  ApiBearerAuth(),
  HttpCode(HttpStatus.NO_CONTENT),
)

@Controller('/v3/products/:masterSku/variants/:variantSku')
export class UpdateVariantBaristaAttributesController {
  constructor(
    private readonly _updateVariantAttributesService: UpdateVariantBaristaAttributesService,
  ) {}

  @UseInterceptors(ReviewStatusInterceptor)
  @UpdateBaristaAttributesSwagger
  @RequirePermissions(AuthPermission.EDIT_PRODUCT)
  @Put('/barista-attributes')
  async updateVariantMarketing(
    @Param('masterSku') masterSku: string,
    @Param('variantSku') variantSku: string,
    @Body()
    body: UpdateVariantBaristaAttributesDto,
  ) {
    return this._updateVariantAttributesService.updateVariant(masterSku, variantSku, body)
  }

  @UseInterceptors(ReviewStatusInterceptor)
  @VariantVersionControllerParamsSwagger
  @RequirePermissions(AuthPermission.EDIT_PRODUCT)
  @Put('/versions/:versionKey/barista-attributes')
  async updateVariantVersionMarketing(
    @Param() params: VariantVersionControllerParams,
    @Body()
    body: UpdateVariantBaristaAttributesDto,
  ) {
    return this._updateVariantAttributesService.updateVariantVersion(
      params.masterSku,
      params.variantSku,
      params.versionKey,
      body,
    )
  }
}
