import { VariantLabelling } from '../../../../shared/model/variant-labelling'
import { ChannelPrice } from '../../../../shared/model/channel-price'
import { Money } from '../../../../shared/model/money'
import { Currency } from '../../../../shared/model/currency'
import { TaxRate } from '../../../../shared/model/tax-rate'
import { MultiLangStringMockFactory } from '../../../product/logic/models/multilang-string'
import { BaristaAttributes } from '../../../../shared/model/barista-attributes'

import { VersionObjectCompletionChecker } from './version-object-completion-checker'

describe('VersionObjectCompletionChecker', () => {
  it('Checks if labelling section is complete when object exists', () => {
    const serviceWithoutLabelling = new VersionObjectCompletionChecker({
      name: undefined,
    })
    const serviceWithLabelling = new VersionObjectCompletionChecker({
      name: undefined,
      labelling: new VariantLabelling({
        storageConditions: null,
        useBy: null,
        sellBy: null,
        legalTitle: null,
        countryOfOriginDescription: null,
        ean13Code: null,
        includeAverageWeightOnLabel: true,
        includeNutritionalInformationOnLabel: true,
        useByTurboChef: null,
        sellByTurboChef: null,
        canBeCookedInTurboChef: true,
        productServes: null,
      }),
    })

    expect(serviceWithoutLabelling.isLabellingSectionComplete()).toBeFalsy()
    expect(serviceWithLabelling.isLabellingSectionComplete()).toBeTruthy()
  })

  it('Checks if reporting section is complete when object exists', () => {
    const serviceWithoutReporting = new VersionObjectCompletionChecker({
      name: undefined,
    })
    const serviceWithReporting = new VersionObjectCompletionChecker({
      name: undefined,
      reporting: {
        parentProductSku: null,
        pluReportingName: null,
        starKisProductCategoryID: null,
        pluSecondaryCategoryID: null,
        posID: null,
        starKisProductSubCategoryID: null,
        pluPrimaryCategoryID: null,
        productRange: [],
      },
    })

    expect(serviceWithoutReporting.isReportingSectionComplete()).toBeFalsy()
    expect(serviceWithReporting.isReportingSectionComplete()).toBeTruthy()
  })

  it('Checks if pricing section is complete when object exists', () => {
    const serviceWithoutPricing = new VersionObjectCompletionChecker({
      name: undefined,
    })
    const serviceWithPricing = new VersionObjectCompletionChecker({
      name: undefined,
      pricing: [
        new ChannelPrice({
          takeAwayPrice: new Money({
            currencyCode: Currency.GBP,
            centAmount: 100,
          }),
          takeAwayClubPret: new Money({
            currencyCode: Currency.GBP,
            centAmount: 100,
          }),
          eatInPrice: new Money({
            currencyCode: Currency.GBP,
            centAmount: 100,
          }),
          eatInClubPret: new Money({
            currencyCode: Currency.GBP,
            centAmount: 100,
          }),
          eatInTax: new TaxRate(0.1),
          deliveryPrice: new Money({
            currencyCode: Currency.GBP,
            centAmount: 100,
          }),
          deliveryTax: new TaxRate(0.1),
          channelName: 'FOO',
        }),
      ],
    })

    expect(serviceWithoutPricing.isPricingSectionComplete()).toBeFalsy()
    expect(serviceWithPricing.isPricingSectionComplete()).toBeTruthy()
  })

  it('Checks if marketing section is complete when object exists', () => {
    const serviceWithoutMarketing = new VersionObjectCompletionChecker({
      name: undefined,
    })
    const serviceWithMarketing = new VersionObjectCompletionChecker({
      name: MultiLangStringMockFactory.createMultiLangString('name'),
      howToDisplay: {
        keys: [],
      },
      availability: {
        displayAsNew: {
          until: null,
          isDisplayed: false,
        },
        visibleOnDeliveryWebsite: false,
        isLive: false,
        isChefsSpecial: false,
        availableForOutposts: false,
        availableForClickAndCollect: false,
        availableForPretDelivers: false,
        availableAllDay: false,
        availableForLunch: false,
      },
      description: MultiLangStringMockFactory.createMultiLangString('desc'),
    })

    expect(serviceWithoutMarketing.isMarketingSectionComplete()).toBeFalsy()
    expect(serviceWithMarketing.isMarketingSectionComplete()).toBeTruthy()
  })

  it('Checks if barista attributes section is complete when object exists', () => {
    const serviceWithoutBaristaAttrs = new VersionObjectCompletionChecker({
      name: undefined,
    })
    const serviceWithBaristaAttrs = new VersionObjectCompletionChecker({
      name: MultiLangStringMockFactory.createMultiLangString('name'),
      baristaAttributes: new BaristaAttributes({
        withDecafPods: false,
        withOatMilk: false,
        withoutMilk: true,
        withRiceCoconutMilk: true,
        withSemiSkimmedMilk: false,
        withSkimmedMilk: true,
        withSoyMilk: false,
      }),
    })

    expect(serviceWithoutBaristaAttrs.isBaristaAttributesSectionComplete()).toBeFalsy()
    expect(serviceWithBaristaAttrs.isBaristaAttributesSectionComplete()).toBeTruthy()
  })
})
