import { VersionCustomObjectMockBuilder } from '../../../variant-version/model/version-custom-object-mock-builder'
import { VariantReviewStatusBuilder } from '../../../product/logic/review-status/review-status-generator/variant-review-status-builder'
import { FieldStatus } from '../../../product/logic/review-status/models/field-status'
import { STATUS_TYPES } from '../../../product/logic/review-status/models/status-types'
import { MultilangString } from '../../../product/logic/models/multilang-string'
import { VersionCustomObjectPayload } from '../../model/version-custom-object'
import { BaristaAttributes } from '../../../../shared/model/barista-attributes'
import { ChannelPrice } from '../../../../shared/model/channel-price'
import { Money } from '../../../../shared/model/money'
import { Currency } from '../../../../shared/model/currency'
import { TaxRate } from '../../../../shared/model/tax-rate'

import { VersionChangesReverter } from './version-changes-reverter'

describe('VersionChangesReverter', () => {
  let versionMock: VersionCustomObjectPayload

  beforeEach(() => {
    versionMock = new VersionCustomObjectMockBuilder().build()
  })

  it('properly reverts marketing changes', () => {
    versionMock.approved = {
      name: {
        'en-GB': 'test name',
        'en-US': 'test name',
      } as MultilangString,
    }

    versionMock.draft = {
      name: {
        'en-GB': 'test name draft',
        'en-US': 'test name draft',
      } as MultilangString,
    }

    const reviewStatuses = new VariantReviewStatusBuilder()
      .withMarketing({
        name: {
          'en-GB': new FieldStatus({ status: STATUS_TYPES.rejected }),
          'en-US': new FieldStatus({ status: STATUS_TYPES.accepted }),
        },
      })
      .build()
    const reverter = new VersionChangesReverter(reviewStatuses, versionMock)

    expect(reverter.revertNameChanges()).toStrictEqual({
      'en-GB': 'test name',
      'en-US': 'test name draft',
    })
  })

  it('properly reverts description changes', () => {
    versionMock.approved = {
      description: {
        'en-GB': 'test description',
        'en-US': 'test description',
      } as MultilangString,
    }

    versionMock.draft = {
      description: {
        'en-GB': 'test description draft',
        'en-US': 'test description draft',
      } as MultilangString,
    }

    const reviewStatuses = new VariantReviewStatusBuilder()
      .withMarketing({
        description: {
          'en-GB': new FieldStatus({ status: STATUS_TYPES.accepted }),
          'en-US': new FieldStatus({ status: STATUS_TYPES.rejected }),
        },
      })
      .build()
    const reverter = new VersionChangesReverter(reviewStatuses, versionMock)

    expect(reverter.revertDescriptionChanges()).toStrictEqual({
      'en-GB': 'test description draft',
      'en-US': 'test description',
    })
  })

  it('properly reverts availability changes', () => {
    const commonAvailability = {
      isLive: false,
      availableAllDay: false,
      availableForLunch: false,
      displayAsNew: {
        isDisplayed: false,
        until: null,
      },
      visibleOnDeliveryWebsite: false,
      isChefsSpecial: false,
    }

    versionMock.approved = {
      availability: {
        availableForClickAndCollect: true,
        availableForPretDelivers: true,
        availableForOutposts: true,
        ...commonAvailability,
      },
    }

    versionMock.draft = {
      availability: {
        availableForClickAndCollect: false,
        availableForPretDelivers: false,
        availableForOutposts: false,
        ...commonAvailability,
      },
    }

    const reviewStatuses = new VariantReviewStatusBuilder()
      .withMarketing({
        availableForClickAndCollect: new FieldStatus({ status: STATUS_TYPES.rejected }),
        availableForPretDelivers: new FieldStatus({ status: STATUS_TYPES.rejected }),
        availableForOutposts: new FieldStatus({ status: STATUS_TYPES.rejected }),
      })
      .build()
    const reverter = new VersionChangesReverter(reviewStatuses, versionMock)

    expect(reverter.revertAvailabilityRejectedChanges()).toStrictEqual({
      availableForClickAndCollect: true,
      availableForPretDelivers: true,
      availableForOutposts: true,
      ...commonAvailability,
    })
  })

  it('properly reverts reporting changes', () => {
    versionMock.approved = {
      reporting: {
        parentProductSku: 'approved',
        pluReportingName: 'approved',
        starKisProductCategoryID: 'approved',
        pluSecondaryCategoryID: 'approved',
        posID: 'approved',
        starKisProductSubCategoryID: 'approved',
        pluPrimaryCategoryID: 'approved',
        productRange: ['approved'],
      },
    }

    versionMock.draft = {
      reporting: {
        parentProductSku: 'draft',
        pluReportingName: 'draft',
        starKisProductCategoryID: 'draft',
        pluSecondaryCategoryID: 'draft',
        posID: 'draft',
        starKisProductSubCategoryID: 'draft',
        pluPrimaryCategoryID: 'draft',
        productRange: ['draft'],
      },
    }

    const reviewStatuses = new VariantReviewStatusBuilder()
      .withReporting({
        parentProductSku: new FieldStatus({ status: STATUS_TYPES.rejected }),
        starKisProductCategoryID: new FieldStatus({ status: STATUS_TYPES.rejected }),
        pluPrimaryCategoryID: new FieldStatus({ status: STATUS_TYPES.rejected }),
      })
      .build()
    const reverter = new VersionChangesReverter(reviewStatuses, versionMock)

    expect(reverter.revertReportingRejectedChanges()).toStrictEqual({
      parentProductSku: 'approved',
      pluReportingName: 'draft',
      starKisProductCategoryID: 'approved',
      pluSecondaryCategoryID: 'draft',
      posID: 'draft',
      starKisProductSubCategoryID: 'draft',
      pluPrimaryCategoryID: 'approved',
      productRange: ['draft'],
    })
  })

  it('properly reverts labelling changes', () => {
    versionMock.approved = {
      labelling: {
        storageConditions: 'approved',
        useBy: 'approved',
        sellBy: 'approved',
        legalTitle: 'approved',
        countryOfOriginDescription: 'approved',
        ean13Code: 'approved',
        includeAverageWeightOnLabel: true,
        includeNutritionalInformationOnLabel: true,
        useByTurboChef: 'approved',
        sellByTurboChef: 'approved',
        canBeCookedInTurboChef: true,
        productServes: 'approved',
      },
    }

    versionMock.draft = {
      labelling: {
        storageConditions: 'draft',
        useBy: 'draft',
        sellBy: 'draft',
        legalTitle: 'draft',
        countryOfOriginDescription: 'draft',
        ean13Code: 'draft',
        includeAverageWeightOnLabel: false,
        includeNutritionalInformationOnLabel: false,
        useByTurboChef: 'draft',
        sellByTurboChef: 'draft',
        canBeCookedInTurboChef: false,
        productServes: 'draft',
      },
    }

    const reviewStatuses = new VariantReviewStatusBuilder()
      .withLabelling({
        useBy: new FieldStatus({ status: STATUS_TYPES.rejected }),
        sellBy: new FieldStatus({ status: STATUS_TYPES.rejected }),
        legalTitle: new FieldStatus({ status: STATUS_TYPES.rejected }),
        includeNutritionalInformationOnLabel: new FieldStatus({ status: STATUS_TYPES.rejected }),
      })
      .build()
    const reverter = new VersionChangesReverter(reviewStatuses, versionMock)

    expect(reverter.revertLabellingRejectedChanges()).toStrictEqual({
      storageConditions: 'draft',
      useBy: 'approved',
      sellBy: 'approved',
      legalTitle: 'approved',
      countryOfOriginDescription: 'draft',
      ean13Code: 'draft',
      includeAverageWeightOnLabel: false,
      includeNutritionalInformationOnLabel: true,
      useByTurboChef: 'draft',
      sellByTurboChef: 'draft',
      canBeCookedInTurboChef: false,
      productServes: 'draft',
    })
  })

  it('properly reverts attributes changes', () => {
    versionMock.approved = {
      baristaAttributes: new BaristaAttributes({
        withDecafPods: true,
        withOatMilk: true,
        withoutMilk: true,
        withRiceCoconutMilk: true,
        withSemiSkimmedMilk: true,
        withSkimmedMilk: true,
        withSoyMilk: true,
      }),
    }

    versionMock.draft = {
      baristaAttributes: new BaristaAttributes({
        withDecafPods: false,
        withOatMilk: false,
        withoutMilk: false,
        withRiceCoconutMilk: false,
        withSemiSkimmedMilk: false,
        withSkimmedMilk: false,
        withSoyMilk: false,
      }),
    }

    const reviewStatuses = new VariantReviewStatusBuilder()
      .withAttributes({
        withDecafPods: new FieldStatus({ status: STATUS_TYPES.rejected }),
        withOatMilk: new FieldStatus({ status: STATUS_TYPES.rejected }),
        withoutMilk: new FieldStatus({ status: STATUS_TYPES.rejected }),
        withRiceCoconutMilk: new FieldStatus({ status: STATUS_TYPES.accepted }),
        withSemiSkimmedMilk: new FieldStatus({ status: STATUS_TYPES.accepted }),
        withSkimmedMilk: new FieldStatus({ status: STATUS_TYPES.accepted }),
      })
      .build()
    const reverter = new VersionChangesReverter(reviewStatuses, versionMock)

    expect(reverter.revertAttributesRejectedChanges()).toEqual({
      withDecafPods: true,
      withOatMilk: true,
      withoutMilk: true,
      withRiceCoconutMilk: false,
      withSemiSkimmedMilk: false,
      withSkimmedMilk: false,
      withSoyMilk: false,
    })
  })

  it('properly reverts pricing changes', () => {
    versionMock.approved = {
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
          channelName: 'uk_core',
        }),
      ],
    }

    versionMock.draft = {
      pricing: [
        new ChannelPrice({
          takeAwayPrice: new Money({
            currencyCode: Currency.GBP,
            centAmount: 200,
          }),
          takeAwayClubPret: new Money({
            currencyCode: Currency.GBP,
            centAmount: 200,
          }),
          eatInPrice: new Money({
            currencyCode: Currency.GBP,
            centAmount: 200,
          }),
          eatInClubPret: new Money({
            currencyCode: Currency.GBP,
            centAmount: 200,
          }),
          eatInTax: new TaxRate(0.1),
          deliveryPrice: new Money({
            currencyCode: Currency.GBP,
            centAmount: 200,
          }),
          deliveryTax: new TaxRate(0.1),
          channelName: 'uk_core',
        }),
      ],
    }

    const reviewStatuses = new VariantReviewStatusBuilder()
      .withPrices([
        {
          ...new FieldStatus({ status: STATUS_TYPES.rejected }),
          value: {
            channelName: 'uk_core',
            field: 'takeAwayPrice',
          },
        },
        {
          ...new FieldStatus({ status: STATUS_TYPES.accepted }),
          value: {
            channelName: 'uk_core',
            field: 'eatInPrice',
          },
        },
      ])
      .build()
    const reverter = new VersionChangesReverter(reviewStatuses, versionMock)

    expect(reverter.revertPricingRejectedChanges()).toEqual([
      { ...versionMock.draft.pricing![0], takeAwayPrice: { centAmount: 100, currencyCode: 'GBP' } },
    ])
  })
})
