import {
  BaristaProductVariant,
  FoodProductVariant,
} from '../../../../product-variant/product-variant'
import { Sku } from '../../../../../shared/model/sku'
import { MultilangString } from '../../models/multilang-string'
import mockDraftProduct from '../../mocks/mock-draft-product'
import { AvailableForCollectionAttribute } from '../../../../product-attributes/common-variant-attributes/available-for-collection-attribute'
import { AvailableForOutpostsAttribute } from '../../../../product-attributes/common-variant-attributes/available-for-outposts-attribute'
import { AvailableForPretDeliversAttribute } from '../../../../product-attributes/common-variant-attributes/available-for-pret-delivers-attribute'
import { PluReportingNameAttribute } from '../../../../product-attributes/common-variant-attributes/plu-reporting-name-attribute'
import { PluPrimaryCategoryAttribute } from '../../../../product-attributes/common-variant-attributes/plu-primary-category-attribute'
import { PluSecondaryCategoryAttribute } from '../../../../product-attributes/common-variant-attributes/plu-secondary-category-attribute'
import { IsDecafPodAttribute } from '../../../../product-attributes/barista-variant-attributes/is-decaf-pod-attribute'
import { IsBlackAttribute } from '../../../../product-attributes/barista-variant-attributes/is-black-attribute'
import { MilkIsSemiSkimmedAttribute } from '../../../../product-attributes/barista-variant-attributes/milk-is-semi-skimmed-attribute'
import { MilkIsSkimmedAttribute } from '../../../../product-attributes/barista-variant-attributes/milk-is-skimmed-attribute'
import { MilkIsOatAttribute } from '../../../../product-attributes/barista-variant-attributes/milk-is-oat-attribute'
import { MilkIsRiceCoconutAttribute } from '../../../../product-attributes/barista-variant-attributes/milk-is-rice-coconut-attribute'
import { MilkIsSoyaAttribute } from '../../../../product-attributes/barista-variant-attributes/milk-is-soya-attribute'
import { CountryOfOriginDescriptionAttribute } from '../../../../product-attributes/common-variant-attributes/country-of-origin-description-attribute'
import { UseByAttribute } from '../../../../product-attributes/common-variant-attributes/use-by-attribute'
import { SellByAttribute } from '../../../../product-attributes/common-variant-attributes/sell-by-attribute'
import { LegalTitleAttribute } from '../../../../product-attributes/food-variant-attributes/legal-title-attribute'
import { IncludeAverageWeightOnLabelAttribute } from '../../../../product-attributes/food-variant-attributes/include-average-weight-on-label-attribute'
import { variantPricesMock } from '../../../../product-variant/mocks/variant-prices.mock'
import { STATUS_TYPES } from '../models/status-types'
import { PriceStatus, VariantReviewStatus } from '../models/variant-review-status'

import { VariantReviewStatusGenerator } from './variant-review-status-generator'

const mockDate = new Date()

describe('VariantReviewStatusGenerator', () => {
  const variant = mockDraftProduct.masterData.staged.masterVariant

  let originalVariant: BaristaProductVariant
  let modifiedVariant: BaristaProductVariant

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(mockDate)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    originalVariant = BaristaProductVariant.create({
      sku: new Sku('UK123'),
      name: new MultilangString({ 'en-GB': 'Test name' }),
      prices: [...variantPricesMock],
      description: new MultilangString({ 'en-GB': 'Test description' }),
      ctAttributes: variant.attributes!,
    })

    modifiedVariant = BaristaProductVariant.create({
      sku: new Sku('UK123'),
      name: new MultilangString({ 'en-GB': 'Test name' }),
      prices: [...variantPricesMock],
      description: new MultilangString({ 'en-GB': 'Test description' }),
      ctAttributes: variant.attributes!,
    })
  })

  it('creates proper diff object if there are no changes', () => {
    const variantStatusGenerator = new VariantReviewStatusGenerator(
      originalVariant,
      modifiedVariant,
    )

    expect(variantStatusGenerator.getStatusObject()).toEqual({
      attributes: {},
      labelling: null,
      marketing: {},
      prices: [],
      reporting: {},
    })
  })

  it('creates proper marketing diff object for changed name and description', () => {
    modifiedVariant.name['en-GB'] = 'Test name modified'
    modifiedVariant.description['en-GB'] = 'Test description modified'

    const variantStatusGenerator = new VariantReviewStatusGenerator(
      originalVariant,
      modifiedVariant,
    )

    expect(variantStatusGenerator.getMarketingDiff()).toEqual({
      name: {
        'en-GB': {
          modifiedAt: mockDate.toISOString(),
          status: 'PENDING',
          user: {
            id: null,
            name: null,
          },
        },
      },
      description: {
        'en-GB': {
          modifiedAt: mockDate.toISOString(),
          status: 'PENDING',
          user: {
            id: null,
            name: null,
          },
        },
      },
    })
  })

  it('creates proper diff object for changed availability attributes', () => {
    modifiedVariant.commonAttributes.availableForCollection = new AvailableForCollectionAttribute(
      !modifiedVariant.commonAttributes.availableForCollection?.value,
    )
    modifiedVariant.commonAttributes.availableForPretDelivers =
      new AvailableForPretDeliversAttribute(
        !modifiedVariant.commonAttributes.availableForPretDelivers?.value,
      )
    modifiedVariant.commonAttributes.availableForOutposts = new AvailableForOutpostsAttribute(
      !modifiedVariant.commonAttributes.availableForOutposts?.value,
    )

    const variantStatusGenerator = new VariantReviewStatusGenerator(
      originalVariant,
      modifiedVariant,
    )

    expect(variantStatusGenerator.getMarketingDiff()).toEqual({
      availableForClickAndCollect: {
        modifiedAt: mockDate.toISOString(),
        status: STATUS_TYPES.pending,
        user: {
          id: null,
          name: null,
        },
      },
      availableForPretDelivers: {
        modifiedAt: mockDate.toISOString(),
        status: STATUS_TYPES.pending,
        user: {
          id: null,
          name: null,
        },
      },
      availableForOutposts: {
        modifiedAt: mockDate.toISOString(),
        status: STATUS_TYPES.pending,
        user: {
          id: null,
          name: null,
        },
      },
    })
  })

  it('creates proper diff object for changed reporting attributes', () => {
    modifiedVariant.commonAttributes.pluReportingName = new PluReportingNameAttribute(
      `${modifiedVariant.commonAttributes.pluReportingName?.value} draft`,
    )
    modifiedVariant.commonAttributes.pluPrimaryCategoryID = new PluPrimaryCategoryAttribute(
      `${modifiedVariant.commonAttributes.pluPrimaryCategoryID?.value} draft`,
    )
    modifiedVariant.commonAttributes.pluSecondaryCategoryID = new PluSecondaryCategoryAttribute(
      `${modifiedVariant.commonAttributes.pluSecondaryCategoryID?.value} draft`,
    )

    const variantStatusGenerator = new VariantReviewStatusGenerator(
      originalVariant,
      modifiedVariant,
    )

    expect(variantStatusGenerator.getReportingDiff()).toEqual({
      pluReportingName: {
        modifiedAt: mockDate.toISOString(),
        status: STATUS_TYPES.pending,
        user: {
          id: null,
          name: null,
        },
      },
      pluPrimaryCategoryID: {
        modifiedAt: mockDate.toISOString(),
        status: STATUS_TYPES.pending,
        user: {
          id: null,
          name: null,
        },
      },
      pluSecondaryCategoryID: {
        modifiedAt: mockDate.toISOString(),
        status: STATUS_TYPES.pending,
        user: {
          id: null,
          name: null,
        },
      },
    })
  })

  it('creates proper diff object for changed prices', () => {
    modifiedVariant.prices[0] = {
      ...modifiedVariant.prices[0],
      custom: {
        fields: {
          ...(modifiedVariant.prices[0].custom?.fields || {}),
          eatInTax: 0.26,
        },
        type: {} as any,
      },
    }

    const variantStatusGenerator = new VariantReviewStatusGenerator(
      originalVariant,
      modifiedVariant,
    )

    const channelName = modifiedVariant.prices[0].channel?.obj?.key || ''

    expect(variantStatusGenerator.getPricingDiff()).toEqual([
      {
        modifiedAt: mockDate.toISOString(),
        status: STATUS_TYPES.pending,
        user: {
          id: null,
          name: null,
        },
        value: {
          channelName: channelName,
          field: 'eatInTax',
        },
      },
    ])
  })

  it('keeps existing prices statuses when new object is generated', () => {
    modifiedVariant.prices[0] = {
      ...modifiedVariant.prices[0],
      custom: {
        fields: {
          ...(modifiedVariant.prices[0].custom?.fields || {}),
          eatInTax: 0.26,
        },
        type: {} as any,
      },
    }

    const channelName = modifiedVariant.prices[0].channel?.obj?.key || ''

    const originalPriceStatus: PriceStatus = {
      modifiedAt: mockDate.toISOString(),
      status: STATUS_TYPES.pending,
      user: {
        id: null,
        name: null,
      },
      value: {
        channelName: channelName,
        field: 'eatInPrice',
      },
    }

    const variantStatusGenerator = new VariantReviewStatusGenerator(
      originalVariant,
      modifiedVariant,
      {
        prices: [originalPriceStatus],
      } as VariantReviewStatus,
    )

    expect(variantStatusGenerator.getPricingDiff()).toEqual([
      originalPriceStatus,
      {
        modifiedAt: mockDate.toISOString(),
        status: STATUS_TYPES.pending,
        user: {
          id: null,
          name: null,
        },
        value: {
          channelName: channelName,
          field: 'eatInTax',
        },
      },
    ])
  })

  it('creates proper diff object for changed barista attributes', () => {
    modifiedVariant.baristaAttributes.isDecafPod = new IsDecafPodAttribute(
      !modifiedVariant.baristaAttributes.isDecafPod?.value,
    )

    modifiedVariant.baristaAttributes.isBlack = new IsBlackAttribute(
      !modifiedVariant.baristaAttributes.isBlack?.value,
    )

    modifiedVariant.baristaAttributes.milkIsSemiSkimmed = new MilkIsSemiSkimmedAttribute(
      !modifiedVariant.baristaAttributes.milkIsSemiSkimmed?.value,
    )

    modifiedVariant.baristaAttributes.milkIsSkimmed = new MilkIsSkimmedAttribute(
      !modifiedVariant.baristaAttributes.milkIsSkimmed?.value,
    )

    modifiedVariant.baristaAttributes.milkIsOat = new MilkIsOatAttribute(
      !modifiedVariant.baristaAttributes.milkIsOat?.value,
    )

    modifiedVariant.baristaAttributes.milkIsRiceCoconut = new MilkIsRiceCoconutAttribute(
      !modifiedVariant.baristaAttributes.milkIsRiceCoconut?.value,
    )

    modifiedVariant.baristaAttributes.milkIsSoya = new MilkIsSoyaAttribute(
      !modifiedVariant.baristaAttributes.milkIsSoya?.value,
    )

    const variantStatusGenerator = new VariantReviewStatusGenerator(
      originalVariant,
      modifiedVariant,
    )

    expect(variantStatusGenerator.getAttributesDiff()).toEqual({
      withDecafPods: {
        modifiedAt: mockDate.toISOString(),
        status: STATUS_TYPES.pending,
        user: {
          id: null,
          name: null,
        },
      },
      withOatMilk: {
        modifiedAt: mockDate.toISOString(),
        status: STATUS_TYPES.pending,
        user: {
          id: null,
          name: null,
        },
      },
      withoutMilk: {
        modifiedAt: mockDate.toISOString(),
        status: STATUS_TYPES.pending,
        user: {
          id: null,
          name: null,
        },
      },
      withRiceCoconutMilk: {
        modifiedAt: mockDate.toISOString(),
        status: STATUS_TYPES.pending,
        user: {
          id: null,
          name: null,
        },
      },
      withSemiSkimmedMilk: {
        modifiedAt: mockDate.toISOString(),
        status: STATUS_TYPES.pending,
        user: {
          id: null,
          name: null,
        },
      },
      withSkimmedMilk: {
        modifiedAt: mockDate.toISOString(),
        status: STATUS_TYPES.pending,
        user: {
          id: null,
          name: null,
        },
      },
      withSoyMilk: {
        modifiedAt: mockDate.toISOString(),
        status: STATUS_TYPES.pending,
        user: {
          id: null,
          name: null,
        },
      },
    })
  })

  describe('Food type product variant', () => {
    let originalFoodVariant: FoodProductVariant
    let modifiedFoodVariant: FoodProductVariant

    beforeEach(() => {
      originalFoodVariant = FoodProductVariant.create({
        sku: new Sku('UK123'),
        name: new MultilangString({ 'en-GB': 'Test name' }),
        prices: [...variantPricesMock],
        description: new MultilangString({ 'en-GB': 'Test description' }),
        ctAttributes: variant.attributes!,
      })

      modifiedFoodVariant = FoodProductVariant.create({
        sku: new Sku('UK123'),
        name: new MultilangString({ 'en-GB': 'Test name' }),
        prices: [...variantPricesMock],
        description: new MultilangString({ 'en-GB': 'Test description' }),
        ctAttributes: variant.attributes!,
      })
    })

    it('creates proper diff object for changed labelling attributes', () => {
      modifiedFoodVariant.foodAttributes.countryOfOriginDescription =
        new CountryOfOriginDescriptionAttribute(
          `${modifiedFoodVariant.foodAttributes.countryOfOriginDescription?.value} draft`,
        )

      modifiedFoodVariant.foodAttributes.useBy = new UseByAttribute(
        `${modifiedFoodVariant.foodAttributes.useBy?.value} draft`,
      )

      modifiedFoodVariant.foodAttributes.sellBy = new SellByAttribute(
        `${modifiedFoodVariant.foodAttributes.useBy?.value} draft`,
      )

      modifiedFoodVariant.foodAttributes.legalTitle = new LegalTitleAttribute(
        `${modifiedFoodVariant.foodAttributes.legalTitle?.value} draft`,
      )

      modifiedFoodVariant.foodAttributes.includeAverageWeightOnLabel =
        new IncludeAverageWeightOnLabelAttribute(
          !modifiedFoodVariant.foodAttributes.includeAverageWeightOnLabel?.value,
        )

      const variantStatusGenerator = new VariantReviewStatusGenerator(
        originalFoodVariant,
        modifiedFoodVariant,
      )

      expect(variantStatusGenerator.getLabellingDiff()).toEqual({
        countryOfOriginDescription: {
          modifiedAt: mockDate.toISOString(),
          status: STATUS_TYPES.pending,
          user: {
            id: null,
            name: null,
          },
        },
        useBy: {
          modifiedAt: mockDate.toISOString(),
          status: STATUS_TYPES.pending,
          user: {
            id: null,
            name: null,
          },
        },
        sellBy: {
          modifiedAt: mockDate.toISOString(),
          status: STATUS_TYPES.pending,
          user: {
            id: null,
            name: null,
          },
        },
        legalTitle: {
          modifiedAt: mockDate.toISOString(),
          status: STATUS_TYPES.pending,
          user: {
            id: null,
            name: null,
          },
        },
        includeAverageWeightOnLabel: {
          modifiedAt: mockDate.toISOString(),
          status: STATUS_TYPES.pending,
          user: {
            id: null,
            name: null,
          },
        },
      })
    })
  })
})
