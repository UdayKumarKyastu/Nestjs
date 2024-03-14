import {
  ClientResponse,
  Product,
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
import { BaristaAttributes } from '../../../../shared/model/barista-attributes'
import { CommercetoolsCustomObjectDao } from '../../../commercetools/commercetools-custom-object.dao'

import { ApproveVersionChangesService } from './approve-version-changes.service'

describe('ApproveVersionChangesService', () => {
  let mockFetcher: Pick<ICanFetchVariantVersions, 'fetchVariantVersionByKeyOrThrow'> & {
    mock: VariantVersionWithId
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
              status: 'accepted',
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
    async writeCustomObject(
      objectKey: string,
      container: string,
      data: any,
    ): Promise<ClientResponse<CustomObject>> {
      return null as any
    },
    async getCustomObjectsByIds(
      ids: string[],
    ): Promise<ClientResponse<CustomObjectPagedQueryResponse>> {
      return null as any
    },
  } as CommercetoolsCustomObjectDao

  beforeEach(() => {
    mockFetcher = {
      mock: {
        id: 'd4ef0ac9-e9fe-4a9a-8865-4fdeafdc3043',
        data: {
          approved: {
            name: MultiLangStringMockFactory.createMultiLangString('name appr'),
            description: MultiLangStringMockFactory.createMultiLangString('name appr'),
            availability: {
              displayAsNew: {
                isDisplayed: false,
                until: null,
              },
              availableAllDay: true,
              availableForClickAndCollect: true,
              availableForLunch: true,
              availableForOutposts: true,
              availableForPretDelivers: true,
              isChefsSpecial: true,
              isLive: true,
              visibleOnDeliveryWebsite: true,
            },
            baristaAttributes: new BaristaAttributes({
              withDecafPods: true,
              withSkimmedMilk: true,
              withSemiSkimmedMilk: true,
              withRiceCoconutMilk: true,
              withSoyMilk: true,
              withoutMilk: true,
              withOatMilk: true,
            }),
            reporting: {
              parentProductSku: null,
              pluReportingName: null,
              pluPrimaryCategoryID: null,
              pluSecondaryCategoryID: null,
              starKisProductSubCategoryID: null,
              posID: null,
              starKisProductCategoryID: null,
              productRange: [],
            },
            labelling: {
              storageConditions: null,
              ean13Code: null,
              countryOfOriginDescription: null,
              includeAverageWeightOnLabel: true,
              legalTitle: null,
              sellBy: null,
              useBy: null,
              includeNutritionalInformationOnLabel: true,
              useByTurboChef: null,
              sellByTurboChef: null,
              canBeCookedInTurboChef: true,
              productServes: null,
            },
            pricing: [],
            howToDisplay: {
              keys: [],
            },
          },
          draft: {
            name: MultiLangStringMockFactory.createMultiLangString('name draft'),
            description: MultiLangStringMockFactory.createMultiLangString('name appr'),
            availability: {
              displayAsNew: {
                isDisplayed: false,
                until: null,
              },
              availableAllDay: true,
              availableForClickAndCollect: true,
              availableForLunch: true,
              availableForOutposts: true,
              availableForPretDelivers: true,
              isChefsSpecial: true,
              isLive: true,
              visibleOnDeliveryWebsite: true,
            },
            baristaAttributes: new BaristaAttributes({
              withDecafPods: true,
              withSkimmedMilk: true,
              withSemiSkimmedMilk: true,
              withRiceCoconutMilk: true,
              withSoyMilk: true,
              withoutMilk: true,
              withOatMilk: true,
            }),
            reporting: {
              parentProductSku: null,
              pluReportingName: null,
              pluPrimaryCategoryID: null,
              pluSecondaryCategoryID: null,
              starKisProductSubCategoryID: null,
              posID: null,
              starKisProductCategoryID: null,
              productRange: [],
            },
            labelling: {
              storageConditions: null,
              ean13Code: null,
              countryOfOriginDescription: null,
              includeAverageWeightOnLabel: true,
              legalTitle: null,
              sellBy: null,
              useBy: null,
              includeNutritionalInformationOnLabel: true,
              useByTurboChef: null,
              sellByTurboChef: null,
              canBeCookedInTurboChef: true,
              productServes: null,
            },
            pricing: [],
            howToDisplay: {
              keys: [],
            },
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
      },
      async fetchVariantVersionByKeyOrThrow(versionKey: string): Promise<VariantVersionWithId> {
        return this.mock
      },
    }
  })

  it('Copy draft object data and set it to be approved', () => {
    jest.spyOn(mockUpdater, 'updateVariantVersion')

    const service = new ApproveVersionChangesService(
      mockFetcher,
      mockUpdater,
      {
        async getOneProductBySkuOrThrow(sku: string): Promise<Product> {
          return {
            productType: {
              obj: {
                key: 'food',
              },
            },
          } as any as Product
        },
      },
      mockCustomObjectService,
    )

    service.approveDraftChanges('UK12345', 'FP12345').then(() => {
      expect(mockUpdater.updateVariantVersion as jest.Mock).toHaveBeenCalledWith(
        'FP12345',
        expect.objectContaining({
          approved: expect.objectContaining({
            name: expect.objectContaining({
              'en-GB': 'name draft-en-GB',
            }),
          }),
        }),
      )
    })
  })

  it('Throws error if there are no approved changes at all', async () => {
    const service = new ApproveVersionChangesService(
      mockFetcher,
      mockUpdater,
      {
        async getOneProductBySkuOrThrow(sku: string): Promise<Product> {
          return {
            productType: {
              obj: {
                key: 'food',
              },
            },
          } as any as Product
        },
      },
      mockCustomObjectService,
    )

    mockFetcher.mock.data.approved = undefined

    try {
      await service.approveDraftChanges('foo', 'bar')
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`[Error: Forbidden Exception]`)
    }
  })

  it('Throws error if there are no necessary field (availability)', async () => {
    const service = new ApproveVersionChangesService(
      mockFetcher,
      mockUpdater,
      {
        async getOneProductBySkuOrThrow(sku: string): Promise<Product> {
          return {
            productType: {
              obj: {
                key: 'food',
              },
            },
          } as any as Product
        },
      },
      mockCustomObjectService,
    )

    mockFetcher.mock.data.approved!.availability = undefined

    try {
      await service.approveDraftChanges('foo', 'bar')
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`[Error: Forbidden Exception]`)
    }
  })

  it('Throws error if there are no necessary required barista field', async () => {
    const service = new ApproveVersionChangesService(
      mockFetcher,
      mockUpdater,
      {
        async getOneProductBySkuOrThrow(sku: string): Promise<Product> {
          return {
            productType: {
              obj: {
                key: 'barista_beverage',
              },
            },
          } as any as Product
        },
      },
      mockCustomObjectService,
    )

    mockFetcher.mock.data.approved!.baristaAttributes = undefined

    try {
      await service.approveDraftChanges('foo', 'bar')
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`[Error: Forbidden Exception]`)
    }
  })

  it('Throws error if there are no necessary required food field', async () => {
    const service = new ApproveVersionChangesService(
      mockFetcher,
      mockUpdater,
      {
        async getOneProductBySkuOrThrow(sku: string): Promise<Product> {
          return {
            productType: {
              obj: {
                key: 'food',
              },
            },
          } as any as Product
        },
      },
      mockCustomObjectService,
    )

    mockFetcher.mock.data.approved!.labelling = undefined

    try {
      await service.approveDraftChanges('foo', 'bar')
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`[Error: Forbidden Exception]`)
    }
  })
})
