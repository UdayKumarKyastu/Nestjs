import { applyDecorators, Controller, Get, Param } from '@nestjs/common'
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

import { SwaggerApiTag } from '../../shared/swagger-api-tag'
import { Ean13CodeAttribute } from '../product-attributes/food-variant-attributes/ean-13-code-attribute'

import { BarcodeService } from './barcode.service'
import { BarcodeParams } from './barcode.dto'

const GetProductSwagger = applyDecorators(
  ApiTags(SwaggerApiTag.ProductVariant),
  ApiParam({
    name: 'barcode',
    example: '036000291452',
    type: 'string',
    required: true,
  }),
  ApiBearerAuth(),
  ApiResponse({
    status: 200,
    description: 'Returns an object with id and sku to indicate if there was match',
  }),
  ApiResponse({
    status: 400,
    description: 'Invalid barcode',
  }),
)

@Controller('/v3/barcode')
export class BarcodeController {
  constructor(private readonly _verifyEan13BarcodeService: BarcodeService) {}

  @GetProductSwagger
  @Get('/:barcode')
  public async verifyEan13Barcode(
    @Param() params: BarcodeParams,
  ): Promise<{ id: string; sku: string | undefined }> {
    return this._verifyEan13BarcodeService.verifyEan13Barcode(
      new Ean13CodeAttribute(params.barcode),
    )
  }
}
