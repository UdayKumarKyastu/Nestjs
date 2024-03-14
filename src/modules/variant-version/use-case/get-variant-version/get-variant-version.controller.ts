import { Controller, Get, Inject, Param } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'

import {
  VariantVersionControllerParams,
  VariantVersionControllerParamsSwagger,
} from '../../variant-version-controller-params'

import { GetVariantVersionDto } from './get-variant-version.dto'
import { GetVariantVersionService, IGetVariantVersionService } from './get-variant-version.service'

@Controller({
  path: '/v3/products/:masterSku/variants/:variantSku/versions/:versionKey',
})
export class GetVariantVersionController {
  constructor(
    @Inject(GetVariantVersionService) private _variantVersionService: IGetVariantVersionService,
  ) {}

  @VariantVersionControllerParamsSwagger
  @ApiResponse({
    type: GetVariantVersionDto,
  })
  @Get()
  async getVariantVersion(
    @Param() queryParams: VariantVersionControllerParams,
  ): Promise<GetVariantVersionDto> {
    return this._variantVersionService.getVariantVersion(queryParams)
  }
}
