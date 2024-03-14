import { ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import { ForbiddenException } from '@nestjs/common'
import {
  CorsOptions,
  CustomOrigin,
} from '@nestjs/common/interfaces/external/cors-options.interface'

import { CorsConfigService } from './cors-config.service'
import { ApplicationConfigService } from './application-config.service'

describe('Cors config service', () => {
  let corsConfigService: CorsConfigService
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CorsConfigService, ApplicationConfigService, ConfigService],
    }).compile()
    corsConfigService = moduleRef.get(CorsConfigService)
  })

  describe('Origin checker', () => {
    it('rejects the request with a forbidden exception if the origin header is not on the allowed list', () => {
      const mockCallback = jest.fn()
      const options = corsConfigService.options as CorsOptions
      const originChecker = options.origin as CustomOrigin

      originChecker('Disallowed-origin', mockCallback)
      expect(mockCallback).toHaveBeenCalledWith(new ForbiddenException(), false)
    })

    it('allows the middleware to continue if the origin header is valid', () => {
      const mockCallback = jest.fn()
      const options = corsConfigService.options as CorsOptions
      const originChecker = options.origin as CustomOrigin

      originChecker('http://localhost:3000', mockCallback)
      expect(mockCallback).toHaveBeenCalledWith(null, true)
    })

    it('allows the middleware to continue if the origin header is missing (mobile apps or curl requests)', () => {
      const mockCallback = jest.fn()
      const options = corsConfigService.options as CorsOptions
      const originChecker = options.origin as CustomOrigin

      originChecker('', mockCallback)
      expect(mockCallback).toHaveBeenCalledWith(null, true)
    })
  })
})
