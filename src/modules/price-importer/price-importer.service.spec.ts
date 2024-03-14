import { HttpModule, HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces'
import { Test, TestingModule } from '@nestjs/testing'
import FormData from 'form-data'
import { of } from 'rxjs'

import { PriceImporterService } from './price-importer.service'

describe('PriceImporterService', () => {
  let configService: ConfigService
  let service: PriceImporterService
  let httpService: HttpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [PriceImporterService, ConfigService],
    }).compile()

    configService = module.get<ConfigService>(ConfigService)
    httpService = module.get<HttpService>(HttpService)
    service = module.get<PriceImporterService>(PriceImporterService)
  })

  describe('upload', () => {
    it.skip('should correctly call the price importer upload endpoint with some form data', async () => {
      jest.spyOn(httpService, 'post').mockImplementation((): any => {
        return of({ data: {} }) as unknown as AxiosResponse<any>
      })
      jest.spyOn(configService, 'get').mockReturnValue('www.dummypriceimporterurl.com')

      const formData = new FormData()
      await service.upload(formData)

      expect(httpService.post).toHaveBeenCalledWith(
        'www.dummypriceimporterurl.com/upload',
        formData,
        { headers: formData.getHeaders() },
      )
    })
  })

  describe('trigger', () => {
    it.skip('should correctly call the price importer trigger endpoint with an import uuid', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('www.dummypriceimporterurl.com')
      jest.spyOn(httpService, 'post').mockImplementation((): any => {
        return of({ data: {} }) as unknown as AxiosResponse<any>
      })

      await service.trigger('uuid')

      expect(httpService.post).toHaveBeenCalledWith(
        'www.dummypriceimporterurl.com/uuid/trigger',
        null,
        { headers: {} },
      )
    })
  })

  describe('getStatus', () => {
    it.skip('should correctly call the price importer status endpoint with a uuid', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('www.dummypriceimporterurl.com')
      jest.spyOn(httpService, 'get').mockImplementation((): any => {
        return of({ data: {} }) as unknown as AxiosResponse<any>
      })

      await service.getStatus('uuid')

      expect(httpService.get).toHaveBeenCalledWith('www.dummypriceimporterurl.com/uuid/status', {
        headers: {},
      })
    })
  })
})
