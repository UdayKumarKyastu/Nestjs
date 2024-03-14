import { Controller, Get } from '@nestjs/common'
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus'

import { ApplicationConfigService } from '../../configuration/services/application-config.service'

@Controller('v1/health')
export class HealthController {
  constructor(
    private readonly _healthCheckService: HealthCheckService,
    private readonly _httpHealthIndicator: HttpHealthIndicator,
    private readonly _appConfigService: ApplicationConfigService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const url = `${this._appConfigService.baseApiUrl}/v1/version`

    return this._healthCheckService.check([
      () => this._httpHealthIndicator.pingCheck('version', url),
    ])
  }
}
