import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'

import { ConfigurationModule } from '../../configuration/configuration.module'

import { HealthController } from './health.controller'

@Module({
  imports: [TerminusModule, ConfigurationModule],
  controllers: [HealthController],
  providers: [],
})
export class HealthModule {}
