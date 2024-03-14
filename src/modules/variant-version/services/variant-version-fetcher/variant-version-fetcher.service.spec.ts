import {
  ClientResponse,
  CustomObject,
  CustomObjectPagedQueryResponse,
} from '@commercetools/platform-sdk'

import { ICanFetchCustomObjects } from '../../../commercetools/commercetools-custom-object.dao'
import { VersionCustomObjectPayload } from '../../model/version-custom-object'

import { VariantVersionFetcherService } from './variant-version-fetcher.service'

const versionReferenceAttributeName = 'productVariantVersions'

const createMockCtVariantVersion = (name = 'some name'): VersionCustomObjectPayload => {
  return {
    hg: {
      productId: { code: 'FP123123', version: '1' },
      productCountry: 'UK',
      version: 1,
      averageWeight: 100,
      name: name,
      liveFrom: new Date().toISOString(),
      country: 'UK',
      ingredients: {
        'en-GB': '',
      },
      lastUpdatedFromHG: new Date().toISOString(),
      localizedClaims: [],
      localizedContainsAllergens: [],
      nutritionals: [],
      suitableForVegans: true,
      suitableForVegetarians: true,
      hgCode: 'HG12345',
      constituentItems: [],
      hgRecipeStatus: 'Approved',
      recipeType: [],
    },
    key: 'FP123123',
  }
}

describe('VariantVersionService', function () {
  it('Fetches versions from given variant and returns raw CT object', async () => {
    const dao: ICanFetchCustomObjects = {
      async getCustomObjectsByIds(
        ids: string[],
      ): Promise<ClientResponse<CustomObjectPagedQueryResponse>> {
        return {
          statusCode: 200,
          headers: {},
          body: {
            count: 2,
            limit: 2,
            offset: 0,
            total: 2,
            results: [
              {
                id: 'REFERENCE_1',
                key: '',
                container: '',
                version: 1,
                lastModifiedAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                value: {
                  ...createMockCtVariantVersion('Version 1'),
                  hgCode: 'HG12345',
                },
              },
              {
                id: 'REFERENCE_2',
                key: '',
                container: '',
                version: 1,
                lastModifiedAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                value: {
                  ...createMockCtVariantVersion('Version 2'),
                  hgCode: 'HG12346',
                },
              },
            ],
          },
        }
      },
      getCustomObjectByKey(key: string): Promise<CustomObject | null> {
        return this.getCustomObjectsByIds([]).then((r) => r.body.results[0])
      },
      getCustomObjectByKeyOrThrow(key: string): Promise<CustomObject> {
        return this.getCustomObjectByKey(key).then((r) => {
          if (!r) {
            throw new Error()
          }

          return r
        })
      },
    }

    const service = new VariantVersionFetcherService(dao)

    const versions = await service.fetchVariantVersionsForVariant('UK12345', {
      attributes: [
        {
          name: versionReferenceAttributeName,
          value: [
            {
              typeId: 'key-value-document',
              id: 'REFERENCE_1',
            },
            {
              typeId: 'key-value-document',
              id: 'REFERENCE_2',
            },
          ],
        },
      ],
    })

    expect(versions[0].id).toBe('REFERENCE_1')
    expect(versions[0].data.hg.name).toBe('Version 1')
    expect(versions[1].id).toBe('REFERENCE_2')
    expect(versions[1].data.hg.name).toBe('Version 2')
  })
})
