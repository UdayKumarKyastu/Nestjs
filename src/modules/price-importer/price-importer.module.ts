import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from '../auth/auth.module'

import { PriceImporterService } from './price-importer.service'
import { UploadController } from './use-cases/upload/upload.controller'
import { TriggerController } from './use-cases/trigger/trigger.controller'
import { StatusController } from './use-cases/status/status.controller'

@Module({
  imports: [HttpModule, ConfigModule, AuthModule],
  providers: [PriceImporterService],
  controllers: [UploadController, StatusController, TriggerController],
})
export class PriceImporterModule {}
