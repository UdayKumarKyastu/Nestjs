import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

import { AuthModule } from '../../../auth/auth.module'
import { PriceImporterService } from '../../price-importer.service'

import { TriggerController } from './trigger.controller'

describe('TriggerController', () => {
  let controller: TriggerController
  let priceImporter: PriceImporterService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule, AuthModule],
      providers: [PriceImporterService],
      controllers: [TriggerController],
    }).compile()

    priceImporter = module.get<PriceImporterService>(PriceImporterService)
    controller = module.get<TriggerController>(TriggerController)
  })

  it('should return the response from the price importer service', async () => {
    const importRes = {
      status: 'PROCESSING',
      errors: [],
      triggeredAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    }
    jest.spyOn(priceImporter, 'trigger').mockResolvedValue(importRes)

    const res = await controller.triggerPriceImport('uuid')

    expect(res).toBe(importRes)
    expect(priceImporter.trigger).toHaveBeenCalled()
  })
})
