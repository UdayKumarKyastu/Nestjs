import {
  ClientResponse,
  CustomObject,
  CustomObjectPagedQueryResponse,
} from '@commercetools/platform-sdk'
import { HttpException } from '@nestjs/common/exceptions/http.exception'

import {
  ICanFetchVariantVersions,
  VariantVersionWithId,
} from '../../services/variant-version-fetcher/variant-version-fetcher.service'
import { ICanUpdateVariantVersion } from '../../services/variant-version-updater/variant-version-updater.service'
import {
  VariantVersionCustomObject,
  VersionCustomObjectPayload,
} from '../../model/version-custom-object'
import { MultiLangStringMockFactory } from '../../../product/logic/models/multilang-string'
import { CommercetoolsCustomObjectDao } from '../../../commercetools/commercetools-custom-object.dao'

import { RejectVersionChangesService } from './reject-version-changes.service'

describe('RejectVersionChangesService', () => {
  it('Copy approved object data and set it to be draft', () => {
    const mockFetcher: Pick<ICanFetchVariantVersions, 'fetchVariantVersionByKeyOrThrow'> = {
      async fetchVariantVersionByKeyOrThrow(versionKey: string): Promise<VariantVersionWithId> {
        return {
          id: 'd4ef0ac9-e9fe-4a9a-8865-4fdeafdc3043',
          data: {
            approved: {
              name: MultiLangStringMockFactory.createMultiLangString('name appr'),
              description: MultiLangStringMockFactory.createMultiLangString('name appr'),
            },
            draft: {
              name: MultiLangStringMockFactory.createMultiLangString('name draft'),
              description: MultiLangStringMockFactory.createMultiLangString('name appr'),
            },
            hg: {
              version: 1,
              hgCode: 'FP12345',
              name: 'name',
              averageWeight: 123,
              ingredients: { 'en-GB': '' },
              country: 'UK',
              lastUpdatedFromHG: '',
              liveFrom: '',
              localizedClaims: [],
              localizedContainsAllergens: [],
              nutritionals: [],
              suitableForVegans: true,
              suitableForVegetarians: true,
              productCountry: 'UK',
              productId: {
                code: 'FP12345',
                version: '1',
              },
              constituentItems: [],
              hgRecipeStatus: 'Approved',
              recipeType: [],
            },
            key: 'FP12345',
          },
        }
      },
    }

    const mockUpdater: ICanUpdateVariantVersion = {
      async updateVariantVersion(
        versionKey: string,
        data: VersionCustomObjectPayload,
      ): Promise<ClientResponse<VariantVersionCustomObject>> {
        return null as any
      },
    }

    const mockCustomObjectService = {
      async getCustomObjectByKey(key: string): Promise<CustomObject | null> {
        return {
          value: {
            marketing: {
              availableForClickAndCollect: {
                modifiedAt: '2020-01-01T10:00:00',
                status: 'rejected',
                user: {
                  id: null,
                  name: null,
                },
              },
            },
            prices: [],
          },
        } as any
      },
      async getCustomObjectByKeyOrThrow(key: string, error?: HttpException): Promise<CustomObject> {
        return null as any
      },
      async getCustomObjectsByIds(
        ids: string[],
      ): Promise<ClientResponse<CustomObjectPagedQueryResponse>> {
        return null as any
      },
      async writeCustomObject(
        objectKey: string,
        container: string,
        data: any,
      ): Promise<ClientResponse<CustomObject>> {
        return null as any
      },
    } as CommercetoolsCustomObjectDao

    jest.spyOn(mockUpdater, 'updateVariantVersion')

    const service = new RejectVersionChangesService(
      mockFetcher,
      mockUpdater,
      mockCustomObjectService,
    )

    service.rejectDraftChanges('UK123', 'FP12345').then(() => {
      expect(mockUpdater.updateVariantVersion as jest.Mock).toHaveBeenCalledWith(
        'FP12345',
        expect.objectContaining({
          draft: expect.objectContaining({
            name: expect.objectContaining({
              'en-GB': 'name appr-en-GB',
            }),
          }),
        }),
      )
    })
  })
})
