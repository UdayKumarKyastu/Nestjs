import { applyDecorators, Controller, Get, Param } from '@nestjs/common'
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

import { AuthPermission } from '../../../auth/auth-permission'
import { RequirePermissions } from '../../../auth/has-permission.guard'
import { SwaggerApiTag } from '../../../../shared/swagger-api-tag'
import { PriceImporterService } from '../../price-importer.service'

import { GetStatusDto } from './get-status.dto'

const GetStatusSwagger = applyDecorators(
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
    type: GetStatusDto,
    description: 'Returns the status for an import, including errors',
  }),
  ApiResponse({
    status: 404,
    description: 'No uploaded CSV with the UUID provided',
  }),
)

@Controller('/v1/price-importer')
export class StatusController {
  constructor(private readonly _priceImporterService: PriceImporterService) {}

  @Get('/:uuid/status')
  @RequirePermissions(AuthPermission.MANAGE_PRICING_IMPORTS)
  @GetStatusSwagger
  async getImportStatus(@Param('uuid') uuid: string): Promise<GetStatusDto> {
    return this._priceImporterService.getStatus(uuid)
  }
}
