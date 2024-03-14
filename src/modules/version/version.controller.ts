import { Controller, Get } from '@nestjs/common'
import { ApiConsumes, ApiOkResponse, ApiOperation } from '@nestjs/swagger'

import { VersionDto } from './version.dto'

@ApiConsumes('application/json')
@Controller('/v1/version')
export class VersionController {
  @ApiOperation({ summary: 'Version endpoint' })
  @ApiOkResponse({ description: 'Success.', type: VersionDto })
  @Get()
  get(): VersionDto {
    return { applicationName: 'portal-api', version: '0.0.1' }
  }
}
