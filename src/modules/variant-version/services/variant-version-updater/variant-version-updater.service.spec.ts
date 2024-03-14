import { ClientResponse, CustomObject } from '@commercetools/platform-sdk'

import { ICanWriteCustomObjects } from '../../../commercetools/commercetools-custom-object.dao'
import { VersionCustomObjectPayload } from '../../model/version-custom-object'

import { VariantVersionUpdaterService } from './variant-version-updater.service'

const mockPayload: VersionCustomObjectPayload = {
  hg: {
    name: 'Name',
    productCountry: 'UK',
    averageWeight: 123,
    country: '',
    hgCode: 'FP12345',
    ingredients: {
      'en-GB': '',
    },
    lastUpdatedFromHG: '',
    liveFrom: '',
    localizedClaims: [],
    localizedContainsAllergens: [],
    nutritionals: [],
    suitableForVegans: true,
    version: 1,
    suitableForVegetarians: true,
    productId: {
      code: 'FP12345',
      version: '1',
    },
    constituentItems: [],
    hgRecipeStatus: 'Approved',
    recipeType: [],
  },
  key: 'FP12345',
}

describe('VariantVersionUpdaterService', () => {
  it('Gets key abd payload to update and call DAO to set custom object', () => {
    const mockDao: ICanWriteCustomObjects = {
      async writeCustomObject<D extends any>(
        objectKey: string,
        container: string,
        data: D,
      ): Promise<ClientResponse<CustomObject>> {
        return {
          statusCode: 200,
          headers: {},
          body: {} as any,
        }
      },
    }

    jest.spyOn(mockDao, 'writeCustomObject')

    const service = new VariantVersionUpdaterService(mockDao)

    service.updateVariantVersion('FP12345', mockPayload)

    expect(mockDao.writeCustomObject as jest.Mock).toHaveBeenCalledWith(
      'FP12345',
      expect.anything(),
      mockPayload,
    )
  })
})
