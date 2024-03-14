import { pickBy, isEqual, isUndefined } from 'lodash'

import { ProductReviewStatus } from '../models/product-review-status'
import { VariantReviewStatus } from '../models/variant-review-status'
import { FieldStatus } from '../models/field-status'
import { StatusCount } from '../models/status-count'
import { primitiveMarketingFields } from '../review-status-generator/variant-review-status-generator'
import { STATUS_TYPES } from '../models/status-types'
import { VariantVersion } from '../../../../../modules/variant-version/model/variant-version'

export abstract class ReviewStatusCounter {
  static getStatusesForChangedVersionFields(
    reviewStatuses: VariantReviewStatus,
    variantVersion: VariantVersion,
  ): VariantReviewStatus {
    const { approved, draft } = variantVersion

    const isVersionFieldChanged = (approved: string | undefined, draft: string | undefined) => {
      return !isUndefined(approved) && !isEqual(approved, draft)
    }

    const reporting = Object.keys(reviewStatuses?.reporting || {}).reduce((acc, key) => {
      const mappedKey = key as keyof VariantVersion['approved']['reporting']
      if (isVersionFieldChanged(approved?.reporting?.[mappedKey], draft?.reporting?.[mappedKey])) {
        return {
          ...acc,
          [key]: reviewStatuses.reporting?.[mappedKey],
        }
      }

      return acc
    }, {})

    const labelling = Object.keys(reviewStatuses?.labelling || {}).reduce((acc, key) => {
      const mappedKey = key as keyof VariantVersion['approved']['labelling']
      if (isVersionFieldChanged(approved?.labelling?.[mappedKey], draft?.labelling?.[mappedKey])) {
        return {
          ...acc,
          [key]: reviewStatuses.labelling?.[mappedKey],
        }
      }

      return acc
    }, {})

    const attributes = Object.keys(reviewStatuses?.attributes || {}).reduce((acc, key) => {
      const mappedKey = key as keyof VariantVersion['approved']['baristaAttributes']
      if (
        isVersionFieldChanged(
          approved?.baristaAttributes?.[mappedKey],
          draft?.baristaAttributes?.[mappedKey],
        )
      ) {
        return {
          ...acc,
          [key]: reviewStatuses.attributes?.[mappedKey],
        }
      }

      return acc
    }, {})

    const availability = Object.keys(reviewStatuses?.marketing || {}).reduce((acc, key) => {
      const mappedKey = key as keyof VariantVersion['approved']['availability']
      if (
        isVersionFieldChanged(approved?.availability?.[mappedKey], draft?.availability?.[mappedKey])
      ) {
        return {
          ...acc,
          [key]: reviewStatuses.marketing?.[mappedKey],
        }
      }

      return acc
    }, {})

    const prices = reviewStatuses?.prices?.filter(({ value }) => {
      const relatedApprovedPrice = approved.pricing?.find(
        (price) => price.channelName === value.channelName,
      )?.[value.field]

      const relatedDraftPrice = draft.pricing?.find(
        (price) => price.channelName === value.channelName,
      )?.[value.field]

      return !isEqual(relatedApprovedPrice, relatedDraftPrice)
    })

    const name = Object.keys(reviewStatuses?.marketing?.name || {}).reduce((acc, key) => {
      const mappedKey = key as keyof VariantVersion['approved']['name']
      if (isVersionFieldChanged(approved?.name?.[mappedKey], draft?.name?.[mappedKey])) {
        return {
          ...acc,
          [key]: reviewStatuses.marketing?.name?.[mappedKey],
        }
      }

      return acc
    }, {})

    const description = Object.keys(reviewStatuses?.marketing?.description || {}).reduce(
      (acc, key) => {
        const mappedKey = key as keyof VariantVersion['approved']['description']
        if (
          !isUndefined(approved.description?.[mappedKey]) &&
          !isEqual(approved?.description?.[mappedKey], draft?.description?.[mappedKey])
        ) {
          return {
            ...acc,
            [key]: reviewStatuses.marketing?.description?.[mappedKey],
          }
        }

        return acc
      },
      {},
    )

    return {
      ...reviewStatuses,
      marketing: {
        ...reviewStatuses.marketing,
        name,
        description,
        ...availability,
      },
      reporting,
      labelling,
      attributes,
      prices,
    }
  }

  static countStatuses(statuses: FieldStatus[]) {
    const pending = statuses.filter((value) => value.status === STATUS_TYPES.pending).length

    const accepted = statuses.filter((value) => value.status === STATUS_TYPES.accepted).length

    const rejected = statuses.filter((value) => value.status === STATUS_TYPES.rejected).length

    return {
      accepted,
      rejected,
      pending,
    }
  }

  static countProductStatuses(reviewStatuses: ProductReviewStatus | null): StatusCount {
    if (!reviewStatuses) {
      return {
        accepted: 0,
        rejected: 0,
        pending: 0,
      }
    }

    const flatStatuses = Object.values({
      ...(reviewStatuses?.setUp || {}),
    })

    return this.countStatuses([...flatStatuses, ...(reviewStatuses?.categories || [])])
  }

  static countSetupStatuses(reviewStatuses: ProductReviewStatus | null): StatusCount {
    const flatStatuses = Object.values({
      ...(reviewStatuses?.setUp || {}),
    })

    return this.countStatuses(flatStatuses)
  }

  static countCategoriesStatuses(reviewStatuses: ProductReviewStatus | null): StatusCount {
    return this.countStatuses(reviewStatuses?.categories || [])
  }

  static countMarketingStatuses(reviewStatuses: VariantReviewStatus | null): StatusCount {
    const availabilityStatuses = pickBy(reviewStatuses?.marketing, (value, key) =>
      primitiveMarketingFields.includes(key),
    )

    const variantNameStatuses = Object.keys(reviewStatuses?.marketing?.name || {}).reduce(
      (acc, key) => {
        return { ...acc, [`variantName-${key}`]: reviewStatuses?.marketing?.name?.[key] }
      },
      {},
    )

    const variantDesciptionStatuses = Object.keys(
      reviewStatuses?.marketing?.description || {},
    ).reduce((acc, key) => {
      return {
        ...acc,
        [`variantDescription-${key}`]: reviewStatuses?.marketing?.description?.[key],
      }
    }, {})

    const flatStatuses: { [key: string]: FieldStatus } = {
      ...(availabilityStatuses || {}),
      ...variantNameStatuses,
      ...variantDesciptionStatuses,
    }

    if (reviewStatuses?.marketing?.displayAsNewUntil) {
      flatStatuses.displayAsNewUntil = reviewStatuses?.marketing?.displayAsNewUntil
    }

    if (reviewStatuses?.marketing?.isDisplayed) {
      flatStatuses.isDisplayed = reviewStatuses?.marketing?.isDisplayed
    }

    if (reviewStatuses?.marketing?.howToDisplay) {
      flatStatuses.howToDisplay = reviewStatuses?.marketing?.howToDisplay
    }

    return this.countStatuses(Object.values(flatStatuses))
  }

  static countLabellingStatuses(reviewStatuses: VariantReviewStatus | null): StatusCount {
    const flatStatuses = Object.values({
      ...(reviewStatuses?.labelling || {}),
    })

    return this.countStatuses(flatStatuses)
  }

  static countReportingStatuses(reviewStatuses: VariantReviewStatus | null): StatusCount {
    const flatStatuses = Object.values({
      ...(reviewStatuses?.reporting || {}),
    })

    return this.countStatuses(flatStatuses)
  }

  static countAttributesStatuses(reviewStatuses: VariantReviewStatus | null): StatusCount {
    const flatStatuses = Object.values({
      ...(reviewStatuses?.attributes || {}),
    })

    return this.countStatuses(flatStatuses)
  }

  static countPricingStatuses(reviewStatuses: VariantReviewStatus | null): StatusCount {
    return this.countStatuses(reviewStatuses?.prices || [])
  }

  static countVariantStatuses(reviewStatuses: VariantReviewStatus | null): StatusCount {
    if (!reviewStatuses) {
      return {
        accepted: 0,
        rejected: 0,
        pending: 0,
      }
    }

    const tabCounts = {
      marketing: this.countMarketingStatuses(reviewStatuses),
      attributes: this.countAttributesStatuses(reviewStatuses),
      labelling: this.countLabellingStatuses(reviewStatuses),
      pricing: this.countPricingStatuses(reviewStatuses),
      reporting: this.countReportingStatuses(reviewStatuses),
    }

    return Object.values(tabCounts).reduce(
      (acc, count) => {
        return {
          accepted: acc.accepted + count.accepted,
          rejected: acc.rejected + count.rejected,
          pending: acc.pending + count.pending,
        }
      },
      { accepted: 0, rejected: 0, pending: 0 },
    )
  }
}
