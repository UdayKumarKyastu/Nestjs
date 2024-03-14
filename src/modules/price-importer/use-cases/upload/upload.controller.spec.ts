import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

import { AuthModule } from '../../../auth/auth.module'
import { PriceImporterService } from '../../price-importer.service'

import { UploadController } from './upload.controller'

describe('UploadController', () => {
  let controller: UploadController
  let priceImporter: PriceImporterService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule, AuthModule],
      providers: [PriceImporterService],
      controllers: [UploadController],
    }).compile()

    priceImporter = module.get<PriceImporterService>(PriceImporterService)
    controller = module.get<UploadController>(UploadController)
  })

  it('should return the response from the price importer service', async () => {
    const uploadRes = { importId: 123, skuCount: 12 }
    jest.spyOn(priceImporter, 'upload').mockResolvedValue(uploadRes)

    const mockFile = {
      fieldname: 'import',
      buffer: Buffer.from('test'),
      originalname: 'import.csv',
      mimetype: 'text/csv',
    }

    const res = await controller.asyncUploadPriceImportCSV(mockFile)

    expect(res).toBe(uploadRes)
    expect(priceImporter.upload).toHaveBeenCalled()
  })
})
