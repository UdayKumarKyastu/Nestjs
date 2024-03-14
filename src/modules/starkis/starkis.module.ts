import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { SecretManagerService } from '../../configuration/services/secret-manager.service'

import { StarkisService } from './starkis.service'

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [StarkisService, SecretManagerService],
})
export class StarkisModule {}
