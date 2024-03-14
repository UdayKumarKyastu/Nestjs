import { applyDecorators, Controller, Param, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

import { AuthPermission } from '../../../auth/auth-permission'
import { RequirePermissions } from '../../../auth/has-permission.guard'
import { SwaggerApiTag } from '../../../../shared/swagger-api-tag'
import { PriceImporterService } from '../../price-importer.service'

import { TriggerDto } from './trigger.dto'

const TriggerSwagger = applyDecorators(
  ApiTags(SwaggerApiTag.Pricing),
  ApiParam({
    name: 'uuid',
    description: 'UUID which corresponds to a previously uploaded CSV',
    example: 'f1dfef63-ed0f-4030-aab6-50d65bc5739c',
    type: 'string',
    required: true,
  }),
  ApiBearerAuth(),
  ApiResponse({
    status: 200,
    type: TriggerDto,
    description: 'Returns the status for the triggered import, including errors',
  }),
  ApiResponse({
    status: 404,
    description: 'No uploaded CSV with the UUID provided',
  }),
)

@Controller('/v1/price-importer')
export class TriggerController {
  constructor(private readonly _priceImporterService: PriceImporterService) {}

  @Post('/:uuid/trigger')
  @RequirePermissions(AuthPermission.MANAGE_PRICING_IMPORTS)
  @TriggerSwagger
  async triggerPriceImport(@Param('uuid') uuid: string): Promise<TriggerDto> {
    return this._priceImporterService.trigger(uuid)
  }
}
