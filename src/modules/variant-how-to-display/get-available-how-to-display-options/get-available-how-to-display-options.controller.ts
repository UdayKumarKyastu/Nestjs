import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common'
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

import { ProductTypeKey, ProductTypeKeyValidationPipe } from '../../product-type/product-type-key'
import { SwaggerApiTag } from '../../../shared/swagger-api-tag'

import { GetAvailableHowToDisplayOptionsService } from './get-available-how-to-display-options.service'
import { GetAvailableHowToDisplayOptionsDto } from './get-available-how-to-display-options.dto'

@Controller('/v3/product-types/:type')
export class GetAvailableHowToDisplayOptionsController {
  constructor(
    private readonly _getAvailableHowToDisplayOptionsService: GetAvailableHowToDisplayOptionsService,
  ) {}

  @ApiResponse({
    type: GetAvailableHowToDisplayOptionsDto,
  })
  @ApiTags(SwaggerApiTag.ProductType)
  @ApiBearerAuth()
  @ApiParam({
    name: 'type',
    required: true,
    enum: ProductTypeKey,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/how-to-display')
  async getAvailableHowToDisplayOptions(
    @Param('type', ProductTypeKeyValidationPipe) type: ProductTypeKey,
  ): Promise<GetAvailableHowToDisplayOptionsDto> {
    return this._getAvailableHowToDisplayOptionsService.getAvailableOptionsDto(type)
  }
}
