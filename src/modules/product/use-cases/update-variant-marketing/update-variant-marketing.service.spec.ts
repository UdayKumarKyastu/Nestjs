import { Product } from '@commercetools/platform-sdk'
import { Test } from '@nestjs/testing'

import { VariantVersionWithId } from '../../../variant-version/services/variant-version-fetcher/variant-version-fetcher.service'
import { MultilangString } from '../../../product/logic/models/multilang-string'
import { ProductTypeKey } from '../../../product-type/product-type-key'
import { VariantVersionUpdaterService } from '../../../variant-version/services/variant-version-updater/variant-version-updater.service'
import { CtProductDao } from '../../../ct-product/ct-product.dao'
import { VariantVersionFetcherService } from '../../../variant-version/services/variant-version-fetcher/variant-version-fetcher.service'
import { DisplayedAsNew } from '../../../../shared/model/display-as-new'
import { VariantHowToDisplayDao } from '../../../variant-how-to-display/variant-how-to-display.dao'
import { VariantAvailability } from '../../../../shared/model/variant-availability'
import { VariantHowToDisplay } from '../../../../shared/model/variant-how-to-display'
import { VersionCustomObjectMockBuilder } from '../../../variant-version/model/version-custom-object-mock-builder'
import { ReviewStatusService } from '../../logic/review-status/review-status.service'

import { UpdateVariantMarketingService } from './update-variant-marketing.service'
import { UpdateVariantMarketingDto } from './update-variant-marketing.dto'
import { UpdateVariantMarketingDao } from './update-variant-marketing.dao'
import { UpdateVariantMarketingActionsResolver } from './update-variant-marketing-actions-resolver'

const masterSku = 'UK10000'
const variantSku = 'UK10000'
const versionKey = '12345'
const version = 1

const getMockProductToUpdate = (): Product => {
  return {
    version,
    productType: {
      obj: {
        key: ProductTypeKey.BaristaBeverage,
      },
    },
    key: masterSku,
    masterData: {
      current: {
        masterVariant: {
          sku: masterSku,
          attributes: [
            {
              name: 'productVariantVersions',
              value: [
                {
                  typeId: 'key-value-document',
                  id: versionKey,
                },
              ],
            },
          ],
          key: masterSku,
        },
        variants: [],
      },
      staged: {
        masterVariant: {
          sku: masterSku,
          attributes: [
            {
              name: 'productVariantVersions',
              value: [
                {
                  typeId: 'key-value-document',
                  id: versionKey,
                },
              ],
            },
          ],
          key: masterSku,
        },
        variants: [],
      },
      published: true,
    },
  } as any as Product
}

const versionMock = new VersionCustomObjectMockBuilder().withKey(versionKey).build()

const variantMarketingDto: UpdateVariantMarketingDto = {
  name: new MultilangString({}),
  description: new MultilangString({}),
  availableForClickAndCollect: true,
  availableForPretDelivers: true,
  availableForOutposts: true,
  isLive: true,
  visibleOnDeliveryWebsite: true,
  isChefsSpecial: true,
  displayAsNew: new DisplayedAsNew('2021-10-28'),
  howToDisplay: [],
  availableForLunch: true,
  availableAllDay: true,
}

const variantMarketing = {
  name: variantMarketingDto.name,
  description: variantMarketingDto.description,
  availability: VariantAvailability.fromUpdateVariantMarketingDto(variantMarketingDto).serialize(),
  howToDisplay: new VariantHowToDisplay(variantMarketingDto.howToDisplay),
}

describe('UpdateVariantMarketingService', () => {
  let updateVariantMarketingService: UpdateVariantMarketingService
  const mockUpdateVersion = jest.fn()
  const mockUpdateVariant = jest.fn()
  const mockedResolvedActions = [
    {
      action: 'setAttribute',
      name: 'availableForOutposts',
      sku: variantSku,
      value: variantMarketingDto.availableForOutposts,
    },
  ]

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UpdateVariantMarketingService],
    })
      .useMocker((token) => {
        if (token === CtProductDao) {
          return {
            async getOneProductBySku(sku: string): Promise<Product | null> {
              return Promise.resolve(getMockProductToUpdate())
            },
            async getOneProductBySkuOrThrow(sku: string): Promise<Product> {
              return Promise.resolve(getMockProductToUpdate())
            },
          }
        }

        if (token === VariantVersionUpdaterService) {
          return {
            updateVariantVersion: mockUpdateVersion,
          }
        }

        if (token === VariantHowToDisplayDao) {
          return {
            findAll: () => [],
          }
        }

        if (token === UpdateVariantMarketingActionsResolver) {
          return {
            resolveActions: () => mockedResolvedActions,
          }
        }

        if (token === VariantVersionFetcherService) {
          return {
            async fetchVariantVersionByKeyOrThrow(
              versionKey: string,
            ): Promise<VariantVersionWithId> {
              return {
                id: versionKey,
                data: versionMock,
              }
            },
          }
        }

        if (token === UpdateVariantMarketingDao) {
          return {
            updateVariantMarketing: mockUpdateVariant,
          }
        }

        if (token === ReviewStatusService) {
          return {
            setOriginalProduct: () => Promise.resolve(),
            generateFieldReviewStatuses: () => Promise.resolve(),
          }
        }
      })
      .compile()

    updateVariantMarketingService = moduleRef.get<UpdateVariantMarketingService>(
      UpdateVariantMarketingService,
    )
  })

  describe('Update variant', () => {
    it('calls update variant method with proper arguments', async () => {
      await updateVariantMarketingService
        .updateLiveVariant(masterSku, variantSku, variantMarketingDto)
        .then(() => {
          expect(mockUpdateVariant).toHaveBeenCalledWith(variantSku, version, mockedResolvedActions)
        })
    })
  })

  describe('Update version', () => {
    it('updates both draft and approved objects when saving data from variant', async () => {
      await updateVariantMarketingService
        .updateVariantVersion(masterSku, variantSku, versionKey, {
          ...variantMarketingDto,
          isDuplicatedData: true,
        })
        .then(() => {
          expect(mockUpdateVersion).toHaveBeenCalledWith(versionKey, {
            ...versionMock,
            draft: {
              ...variantMarketing,
            },
            approved: {
              ...variantMarketing,
            },
            hasDraftChanges: false,
          })
        })
    })

    it('updates only draft object when edited', async () => {
      await updateVariantMarketingService
        .updateVariantVersion(masterSku, variantSku, versionKey, variantMarketingDto)
        .then(() => {
          expect(mockUpdateVersion).toHaveBeenCalledWith(versionKey, {
            ...versionMock,
            draft: {
              ...variantMarketing,
            },
            hasDraftChanges: true,
          })
        })
    })
  })
})
