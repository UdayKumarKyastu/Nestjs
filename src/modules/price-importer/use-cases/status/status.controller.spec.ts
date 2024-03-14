import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

import { AuthModule } from '../../../auth/auth.module'
import { PriceImporterService } from '../../price-importer.service'

import { StatusController } from './status.controller'

describe('StatusController', () => {
  let controller: StatusController
  let priceImporter: PriceImporterService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule, AuthModule],
      providers: [PriceImporterService],
      controllers: [StatusController],
    }).compile()

    priceImporter = module.get<PriceImporterService>(PriceImporterService)
    controller = module.get<StatusController>(StatusController)
  })

  it('should return the response from the price importer service', async () => {
    const statusResponse = { status: 'COMPLETED', errors: [] }
    jest.spyOn(priceImporter, 'getStatus').mockResolvedValue(statusResponse)

    const res = await controller.getImportStatus('uuid')

    expect(res).toBe(statusResponse)
    expect(priceImporter.getStatus).toHaveBeenCalled()
  })
})
