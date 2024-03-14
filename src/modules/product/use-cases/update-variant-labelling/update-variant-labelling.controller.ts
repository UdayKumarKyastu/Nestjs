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

import { UpdateVariantLabellingDto } from './update-variant-labelling.dto'
import { UpdateVariantLabellingService } from './update-variant-labelling.service'

const UpdateLabellingSwagger = applyDecorators(
  ApiTags(SwaggerApiTag.ProductVariant),
  ApiBearerAuth(),
  HttpCode(HttpStatus.NO_CONTENT),
)

@Controller('/v3/products/:masterSku/variants/:variantSku')
export class UpdateVariantLabellingController {
  constructor(private readonly _updateVariantLabellingService: UpdateVariantLabellingService) {}

  @UseInterceptors(ReviewStatusInterceptor)
  @UpdateLabellingSwagger
  @RequirePermissions(AuthPermission.EDIT_PRODUCT)
  @Put('/labelling')
  async updateVariantLabelling(
    @Param('masterSku') masterSku: string,
    @Param('variantSku') variantSku: string,
    @Body()
    body: UpdateVariantLabellingDto,
  ) {
    return this._updateVariantLabellingService.update(masterSku, variantSku, body)
  }

  @UseInterceptors(ReviewStatusInterceptor)
  @UpdateLabellingSwagger
  @VariantVersionControllerParamsSwagger
  @RequirePermissions(AuthPermission.EDIT_PRODUCT)
  @Put('/versions/:versionKey/labelling')
  async updateVariantVersionLabelling(
    @Param() params: VariantVersionControllerParams,
    @Body()
    body: UpdateVariantLabellingDto,
  ) {
    return this._updateVariantLabellingService.updateVersion(
      params.masterSku,
      params.variantSku,
      params.versionKey,
      body,
    )
  }
}
