import { STATUS_TYPES } from '../models/status-types'
import { VariantReviewStatusBuilder } from '../review-status-generator/variant-review-status-builder'
import { FieldStatus } from '../models/field-status'
import { ProductReviewStatus } from '../models/product-review-status'

import { ReviewStatusCounter } from './review-status-counter'

describe('ReviewStatusCounter', () => {
  it('properly counts 1 accepted, 2 pending and 1 rejected field', () => {
    const reviewStatuses = new VariantReviewStatusBuilder()
      .withMarketing({
        availableForClickAndCollect: new FieldStatus({ status: STATUS_TYPES.accepted }),
        availableForPretDelivers: new FieldStatus({ status: STATUS_TYPES.pending }),
        availableForOutposts: new FieldStatus({ status: STATUS_TYPES.rejected }),
      })
      .withPrices([
        {
          ...new FieldStatus({ status: STATUS_TYPES.pending }),
          value: {
            channelName: 'uk_core',
            field: 'takeAwayPrice',
          },
        },
      ])
      .build()

    const count = ReviewStatusCounter.countVariantStatuses(reviewStatuses)
    expect(count).toStrictEqual({
      accepted: 1,
      pending: 2,
      rejected: 1,
    })
  })

  it('properly counts 5 accepted, 5 pending and 5 rejected fields', () => {
    const reviewStatuses = new VariantReviewStatusBuilder()
      .withMarketing({
        availableForClickAndCollect: new FieldStatus({ status: STATUS_TYPES.accepted }),
        availableForPretDelivers: new FieldStatus({ status: STATUS_TYPES.accepted }),
        availableForOutposts: new FieldStatus({ status: STATUS_TYPES.accepted }),
        availableAllDay: new FieldStatus({ status: STATUS_TYPES.accepted }),
        availableForLunch: new FieldStatus({ status: STATUS_TYPES.accepted }),
      })
      .withReporting({
        pluReportingName: new FieldStatus({ status: STATUS_TYPES.rejected }),
        pluPrimaryCategoryID: new FieldStatus({ status: STATUS_TYPES.rejected }),
        pluSecondaryCategoryID: new FieldStatus({ status: STATUS_TYPES.rejected }),
        starKisProductCategoryID: new FieldStatus({ status: STATUS_TYPES.rejected }),
        starKisProductSubCategoryID: new FieldStatus({ status: STATUS_TYPES.rejected }),
      })
      .withLabelling({
        countryOfOriginDescription: new FieldStatus({ status: STATUS_TYPES.pending }),
        legalTitle: new FieldStatus({ status: STATUS_TYPES.pending }),
        canBeCookedInTurboChef: new FieldStatus({ status: STATUS_TYPES.pending }),
        storageConditions: new FieldStatus({ status: STATUS_TYPES.pending }),
        useBy: new FieldStatus({ status: STATUS_TYPES.pending }),
      })
      .build()

    const count = ReviewStatusCounter.countVariantStatuses(reviewStatuses)
    expect(count).toStrictEqual({
      accepted: 5,
      pending: 5,
      rejected: 5,
    })
  })

  it('properly counts 2 accepted, 2 pending and 1 rejected pricing fields', () => {
    const reviewStatuses = new VariantReviewStatusBuilder()
      .withPrices([
        {
          ...new FieldStatus({ status: STATUS_TYPES.pending }),
          value: {
            channelName: 'uk_core',
            field: 'takeAwayPrice',
          },
        },
        {
          ...new FieldStatus({ status: STATUS_TYPES.pending }),
          value: {
            channelName: 'uk_premium',
            field: 'eatInPrice',
          },
        },
        {
          ...new FieldStatus({ status: STATUS_TYPES.accepted }),
          value: {
            channelName: 'uk_airports',
            field: 'eatInTax',
          },
        },
        {
          ...new FieldStatus({ status: STATUS_TYPES.rejected }),
          value: {
            channelName: 'uk_delivery',
            field: 'eatInPrice',
          },
        },
        {
          ...new FieldStatus({ status: STATUS_TYPES.accepted }),
          value: {
            channelName: 'uk_london_premium',
            field: 'takeAwayPrice',
          },
        },
      ])
      .build()

    const count = ReviewStatusCounter.countVariantStatuses(reviewStatuses)
    expect(count).toStrictEqual({
      accepted: 2,
      pending: 2,
      rejected: 1,
    })
  })

  it('properly counts 2 accepted, 2 pending and 3 rejected product group fields', () => {
    const reviewStatuses: ProductReviewStatus = {
      setUp: {
        iceMachineRequired: new FieldStatus({ status: STATUS_TYPES.accepted }),
        blenderRequired: new FieldStatus({ status: STATUS_TYPES.rejected }),
        canHaveVariants: new FieldStatus({ status: STATUS_TYPES.rejected }),
        canAddSyrup: new FieldStatus({ status: STATUS_TYPES.pending }),
      },
      categories: [
        {
          ...new FieldStatus({ status: STATUS_TYPES.accepted }),
          value: ['c5d020de-8521-433e-96aa-5662655a27d6'],
        },
        {
          ...new FieldStatus({ status: STATUS_TYPES.rejected }),
          value: ['5662655a27d6-c5d020de-8521-433e-96aa'],
        },
        {
          ...new FieldStatus({ status: STATUS_TYPES.pending }),
          value: ['8521-433e-96aa-c5d020de-5662655a27d6'],
        },
      ],
    }

    const count = ReviewStatusCounter.countProductStatuses(reviewStatuses)
    expect(count).toStrictEqual({
      accepted: 2,
      pending: 2,
      rejected: 3,
    })
  })
})
