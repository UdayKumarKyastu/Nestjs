import { Test, TestingModule } from '@nestjs/testing'

import { version } from '../../../package.json'

import { VersionController } from './version.controller'

describe('VersionController', () => {
  let versionController: VersionController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [VersionController],
      providers: [],
    }).compile()

    versionController = app.get<VersionController>(VersionController)
  })

  describe('version endpoint', () => {
    it('should return correct application name and version', () => {
      expect(versionController.get()).toEqual(
        expect.objectContaining({
          applicationName: 'portal-api',
          version: version,
        }),
      )
    })
  })
})
