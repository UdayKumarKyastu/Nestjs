import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'

import { LabellingOptionsDto } from '../../shared/dto/labellingOptions.dto'
import { ProductTypeKey } from '../product-type/product-type-key'
import { SwaggerApiTag } from '../../shared/swagger-api-tag'

import { LabellingOptionsService } from './labelling-options.service'

@Controller(`/v3/product-types/${ProductTypeKey.Food}`)
export class LabellingOptionsController {
  constructor(private readonly _labellingOptionsService: LabellingOptionsService) {}

  @ApiResponse({
    type: LabellingOptionsDto,
  })
  @ApiTags(SwaggerApiTag.ProductType, SwaggerApiTag.FoodProduct)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get('/labelling-options')
  async getAvailableHowToDisplayOptions(): Promise<LabellingOptionsDto> {
    return this._labellingOptionsService.findAll()
  }
}
