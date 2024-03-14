import { Product } from '@commercetools/platform-sdk'
import { Test } from '@nestjs/testing'

import { VariantVersionWithId } from '../../../variant-version/services/variant-version-fetcher/variant-version-fetcher.service'
import { ChannelPrice } from '../../../../shared/model/channel-price'
import { Money } from '../../../../shared/model/money'
import { Currency } from '../../../../shared/model/currency'
import { ProductTypeKey } from '../../../product-type/product-type-key'
import { VariantVersionUpdaterService } from '../../../variant-version/services/variant-version-updater/variant-version-updater.service'
import { CtProductDao } from '../../../ct-product/ct-product.dao'
import { VariantVersionFetcherService } from '../../../variant-version/services/variant-version-fetcher/variant-version-fetcher.service'
import { VersionCustomObjectPayload } from '../../../variant-version/model/version-custom-object'
import { ReviewStatusService } from '../../logic/review-status/review-status.service'

import { UpdateVariantPricingService } from './update-variant-pricing.service'
import { UpdateVariantPricingDto } from './update-variant-pricing.dto'
import { UpdateVariantPricingDao } from './update-variant-pricing.dao'

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
          attributes: [],
          key: masterSku,
        },
        variants: [],
      },
      staged: {
        masterVariant: {
          sku: masterSku,
          attributes: [],
          key: masterSku,
        },
        variants: [],
      },
    },
  } as any as Product
}

const versionMock: VersionCustomObjectPayload = {
  hg: {
    liveFrom: '2020-01-01T10:00:00',
    hgCode: 'FP123',
    lastUpdatedFromHG: '2020-01-01T10:00:00',
    ingredients: { 'en-GB': '' },
    name: 'name',
    version: 1,
    suitableForVegetarians: true,
    country: 'UK',
    localizedClaims: [],
    localizedContainsAllergens: [],
    nutritionals: [],
    averageWeight: 123,
    suitableForVegans: true,
    productCountry: 'UK',
    productId: {
      code: 'FP1234',
      version: '1',
    },
    constituentItems: [],
    hgRecipeStatus: 'Approved',
    recipeType: [],
  },
  key: 'FP1234',
}

const pricingDtoMock: UpdateVariantPricingDto = {
  prices: [
    {
      takeAwayPrice: new Money({
        currencyCode: Currency.GBP,
        centAmount: 100,
      }),
      eatInPrice: new Money({
        currencyCode: Currency.GBP,
        centAmount: 100,
      }),
      takeAwayClubPret: new Money({
        currencyCode: Currency.GBP,
        centAmount: 100,
      }),
      eatInClubPret: new Money({
        currencyCode: Currency.GBP,
        centAmount: 100,
      }),
      eatInTax: 0.1,
      deliveryPrice: new Money({
        currencyCode: Currency.GBP,
        centAmount: 100,
      }),
      deliveryTax: 0.1,
      channelName: 'FOO',
    },
  ],
}

const mappedVersionPricing = pricingDtoMock.prices.map((priceDto) => ChannelPrice.fromDto(priceDto))

describe('UpdateVariantPricingService', () => {
  let updateVariantPricingService: UpdateVariantPricingService
  const mockUpdateVersion = jest.fn()

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UpdateVariantPricingService],
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

        if (token === VariantVersionFetcherService) {
          return {
            async fetchVariantVersionByKeyOrThrow(
              versionKey: string,
            ): Promise<VariantVersionWithId> {
              return {
                id: 'UUID',
                data: versionMock,
              }
            },
          }
        }

        if (token === UpdateVariantPricingDao) {
          return {}
        }

        if (token === ReviewStatusService) {
          return {}
        }
      })
      .compile()

    updateVariantPricingService = moduleRef.get<UpdateVariantPricingService>(
      UpdateVariantPricingService,
    )
  })

  it('updates both draft and approved objects when saving data from variant', async () => {
    await updateVariantPricingService
      .updateVersion(masterSku, variantSku, versionKey, {
        ...pricingDtoMock,
        isDuplicatedData: true,
      })
      .then(() => {
        expect(mockUpdateVersion).toHaveBeenCalledWith(versionKey, {
          ...versionMock,
          approved: {
            pricing: mappedVersionPricing,
          },
          draft: {
            pricing: mappedVersionPricing,
          },
          hasDraftChanges: false,
        })
      })
  })

  it('updates only draft object when edited', async () => {
    await updateVariantPricingService
      .updateVersion(masterSku, variantSku, versionKey, pricingDtoMock)
      .then(() => {
        expect(mockUpdateVersion).toHaveBeenCalledWith(versionKey, {
          ...versionMock,
          draft: {
            pricing: mappedVersionPricing,
          },
          hasDraftChanges: true,
        })
      })
  })
})
