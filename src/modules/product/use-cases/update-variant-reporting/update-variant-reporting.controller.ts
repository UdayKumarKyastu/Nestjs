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

import { UpdateReportingDto } from './update-reporting.dto'
import { UpdateVariantReportingService } from './update-variant-reporting.service'

const UpdateReportingSwagger = applyDecorators(
  ApiTags(SwaggerApiTag.ProductVariant),
  ApiBearerAuth(),
  HttpCode(HttpStatus.NO_CONTENT),
)

@Controller('/v3/products/:masterSku/variants/:variantSku')
export class UpdateVariantReportingController {
  constructor(private readonly _updateVariantReportingService: UpdateVariantReportingService) {}

  @UseInterceptors(ReviewStatusInterceptor)
  @UpdateReportingSwagger
  @RequirePermissions(AuthPermission.EDIT_PRODUCT)
  @Put('/reporting')
  async updateVariantReporting(
    @Param('masterSku') masterSku: string,
    @Param('variantSku') variantSku: string,
    @Body()
    body: UpdateReportingDto,
  ) {
    return this._updateVariantReportingService.updateVariant(masterSku, variantSku, body)
  }

  @UseInterceptors(ReviewStatusInterceptor)
  @VariantVersionControllerParamsSwagger
  @RequirePermissions(AuthPermission.EDIT_PRODUCT)
  @Put('/versions/:versionKey/reporting')
  async updateVariantVersionReporting(
    @Param() params: VariantVersionControllerParams,
    @Body()
    body: UpdateReportingDto,
  ) {
    return this._updateVariantReportingService.updateVersion(
      params.masterSku,
      params.variantSku,
      params.versionKey,
      body,
    )
  }
}
