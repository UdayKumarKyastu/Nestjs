import { Controller, Get, HttpCode, HttpStatus, Inject } from '@nestjs/common'
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger'

import { ProductTypeKey } from '../../../product-type/product-type-key'
import { SwaggerApiTag } from '../../../../shared/swagger-api-tag'
import { VariantReportingOptionsDto } from '../../variant-reporting-options.dto'
import {
  IReportingOptionsResolverService,
  ReportingOptionsResolverService,
} from '../../reporting-options-resolver.service'

@Controller('/v3/product-types/:type')
export class GetAvailableReportingOptionsController {
  constructor(
    @Inject(ReportingOptionsResolverService)
    private readonly _reportingOptionsResolverService: IReportingOptionsResolverService,
  ) {}

  @ApiTags(SwaggerApiTag.ProductType)
  @ApiBearerAuth()
  @ApiParam({
    name: 'type',
    required: true,
    enum: ProductTypeKey,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/reporting')
  async getAvailableReportingOptions(): Promise<VariantReportingOptionsDto> {
    return this._reportingOptionsResolverService.constructDto()
  }
}
