import { cloneDeep, isEqual, merge } from 'lodash'

import {
  BaristaProductVariant,
  FoodProductVariant,
} from '../../../../product-variant/product-variant'
import { VariantAvailability } from '../../../../../shared/model/variant-availability'
import { MultiLangStringDto } from '../../../../../shared/dto/multi-lang-string.dto'
import { FoodVariantAttributes } from '../../../../product-attributes/food-variant-attributes'
import { VariantReviewStatus, PriceStatus } from '../models/variant-review-status'
import { getPricingChannelsKeysByCountryCode } from '../../../../pricing/pricing.service'
import { CountryCode } from '../../../../../shared/model/country-code'

import { ReviewStatusGenerator } from './review-status-generator'

export const primitiveMarketingFields = [
  'availableForClickAndCollect',
  'availableForPretDelivers',
  'availableForOutposts',
  'isLive',
  'visibleOnDeliveryWebsite',
  'isChefsSpecial',
  'availableForLunch',
  'availableAllDay',
]
export class VariantReviewStatusGenerator extends ReviewStatusGenerator {
  constructor(
    private originalVariant: FoodProductVariant | BaristaProductVariant,
    private modifiedVariant: FoodProductVariant | BaristaProductVariant,
    private originalStatusObject: VariantReviewStatus = {} as VariantReviewStatus,
  ) {
    super()
  }

  getAttributesDiff() {
    const originalBaristaAttributes = (
      this.originalVariant as BaristaProductVariant
    ).baristaAttributes.toDto()

    const modifiedBaristaAttributes = (
      this.modifiedVariant as BaristaProductVariant
    ).baristaAttributes.toDto()

    return Object.keys(originalBaristaAttributes).reduce((acc, attribute) => {
      const mappedAttribute = attribute as keyof typeof originalBaristaAttributes
      if (
        !isEqual(
          originalBaristaAttributes[mappedAttribute],
          modifiedBaristaAttributes[mappedAttribute],
        )
      ) {
        return {
          ...acc,
          [mappedAttribute]: this.generateFieldStatusObject(),
        }
      }

      return acc
    }, {})
  }

  getAvailabilityDiff(
    originalAvailability: VariantAvailability,
    modifiedAvailability: VariantAvailability,
  ) {
    const primitiveFieldsDiff: VariantReviewStatus['marketing'] = primitiveMarketingFields.reduce(
      (acc, attribute) => {
        const mappedAttribute = attribute as keyof typeof originalAvailability
        if (
          (originalAvailability?.[mappedAttribute] as { value: boolean | string }).value !==
          (modifiedAvailability?.[mappedAttribute] as { value: boolean | string }).value
        ) {
          return {
            ...acc,
            [mappedAttribute]: this.generateFieldStatusObject(),
          }
        }

        return acc
      },
      {},
    )

    if (
      originalAvailability.displayAsNew.isDisplayed !==
      modifiedAvailability.displayAsNew.isDisplayed
    ) {
      primitiveFieldsDiff.isDisplayed = this.generateFieldStatusObject()
    }

    if (originalAvailability.displayAsNew.until !== modifiedAvailability.displayAsNew.until) {
      primitiveFieldsDiff.displayAsNewUntil = this.generateFieldStatusObject()
    }

    return primitiveFieldsDiff
  }

  getPricingDiff(): VariantReviewStatus['prices'] {
    const pricingChannels = getPricingChannelsKeysByCountryCode(
      this.originalVariant.commonAttributes.country.asEnum(),
    )

    const pricesFilteredByAvailableChannels = (this.modifiedVariant.prices || []).filter((price) =>
      pricingChannels.includes(price.channel?.obj?.key || price.channel?.id || ''),
    )

    return pricesFilteredByAvailableChannels.reduce((acc, modifiedPrice) => {
      const channelName = modifiedPrice.channel?.obj?.key || modifiedPrice.channel?.id || ''

      const currentPrice = this.originalVariant.prices!.find(
        (price) => price.channel?.id === modifiedPrice.channel?.id,
      )!

      const defaultCustomFields = {
        eatInPrice: {
          centAmount: 0,
        },
        eatInTax: 0,
        takeAwayTax: 0,
        deliveryPrice: {
          centAmount: 0,
        },
        deliveryTax: 0,
        takeAwayClubPret: {
          centAmount: 0,
        },
        eatInClubPret: {
          centAmount: 0,
        },
      }

      const liveCustomFields = currentPrice?.custom?.fields || defaultCustomFields
      const draftCustomFields = modifiedPrice?.custom?.fields || defaultCustomFields

      if ((currentPrice?.value?.centAmount || 0) !== modifiedPrice?.value?.centAmount) {
        const takeAwayPriceIndex = acc.findIndex(
          ({ value }) => value.channelName === channelName && value.field === 'takeAwayPrice',
        )

        const takeAwayPriceDiff: PriceStatus = {
          ...this.generateFieldStatusObject(),
          value: {
            channelName: channelName,
            field: 'takeAwayPrice',
          },
        }

        if (takeAwayPriceIndex > -1) {
          acc[takeAwayPriceIndex] = takeAwayPriceDiff
        } else {
          acc.push(takeAwayPriceDiff)
        }
      }

      if (liveCustomFields?.eatInPrice?.centAmount !== draftCustomFields?.eatInPrice?.centAmount) {
        const eatInPriceIndex = acc.findIndex(
          ({ value }) => value.channelName === channelName && value.field === 'eatInPrice',
        )
        const eatInPriceDiff: PriceStatus = {
          ...this.generateFieldStatusObject(),
          value: {
            channelName: channelName,
            field: 'eatInPrice',
          },
        }

        if (eatInPriceIndex > -1) {
          acc[eatInPriceIndex] = eatInPriceDiff
        } else {
          acc.push(eatInPriceDiff)
        }
      }

      if (
        liveCustomFields?.deliveryPrice?.centAmount !== draftCustomFields?.deliveryPrice?.centAmount
      ) {
        const deliveryPriceIndex = acc.findIndex(
          ({ value }) => value.channelName === channelName && value.field === 'deliveryPrice',
        )
        const deliveryPriceDiff: PriceStatus = {
          ...this.generateFieldStatusObject(),
          value: {
            channelName: channelName,
            field: 'deliveryPrice',
          },
        }

        if (deliveryPriceIndex > -1) {
          acc[deliveryPriceIndex] = deliveryPriceDiff
        } else {
          acc.push(deliveryPriceDiff)
        }
      }

      if (
        liveCustomFields?.eatInClubPret?.centAmount !== draftCustomFields?.eatInClubPret?.centAmount
      ) {
        const eatInClubPretIndex = acc.findIndex(
          ({ value }) => value.channelName === channelName && value.field === 'eatInClubPret',
        )
        const eatInClubPretDiff: PriceStatus = {
          ...this.generateFieldStatusObject(),
          value: {
            channelName: channelName,
            field: 'eatInClubPret',
          },
        }

        if (eatInClubPretIndex > -1) {
          acc[eatInClubPretIndex] = eatInClubPretDiff
        } else {
          acc.push(eatInClubPretDiff)
        }
      }

      if (
        liveCustomFields?.takeAwayClubPret?.centAmount !==
        draftCustomFields?.takeAwayClubPret?.centAmount
      ) {
        const takeAwayClubPretIndex = acc.findIndex(
          ({ value }) => value.channelName === channelName && value.field === 'takeAwayClubPret',
        )
        const takeAwayClubPretDiff: PriceStatus = {
          ...this.generateFieldStatusObject(),
          value: {
            channelName: channelName,
            field: 'takeAwayClubPret',
          },
        }

        if (takeAwayClubPretIndex > -1) {
          acc[takeAwayClubPretIndex] = takeAwayClubPretDiff
        } else {
          acc.push(takeAwayClubPretDiff)
        }
      }

      if (liveCustomFields?.eatInTax !== draftCustomFields?.eatInTax) {
        const eatInTaxIndex = acc.findIndex(
          ({ value }) => value.channelName === channelName && value.field === 'eatInTax',
        )
        const eatInTaxDiff: PriceStatus = {
          ...this.generateFieldStatusObject(),
          value: {
            channelName: channelName,
            field: 'eatInTax',
          },
        }

        if (eatInTaxIndex > -1) {
          acc[eatInTaxIndex] = eatInTaxDiff
        } else {
          acc.push(eatInTaxDiff)
        }
      }

      if (this.originalVariant.commonAttributes.country.value !== CountryCode.UK) {
        if (liveCustomFields?.takeAwayTax !== draftCustomFields?.takeAwayTax) {
          const takeAwayTaxIndex = acc.findIndex(
            ({ value }) => value.channelName === channelName && value.field === 'takeAwayTax',
          )
          const takeAwayTaxDiff: PriceStatus = {
            ...this.generateFieldStatusObject(),
            value: {
              channelName: channelName,
              field: 'takeAwayTax',
            },
          }

          if (takeAwayTaxIndex > -1) {
            acc[takeAwayTaxIndex] = takeAwayTaxDiff
          } else {
            acc.push(takeAwayTaxDiff)
          }
        }
      }

      if (liveCustomFields?.deliveryTax !== draftCustomFields?.deliveryTax) {
        const deliveryTaxIndex = acc.findIndex(
          ({ value }) => value.channelName === channelName && value.field === 'deliveryTax',
        )
        const deliveryTaxDiff: PriceStatus = {
          ...this.generateFieldStatusObject(),
          value: {
            channelName: channelName,
            field: 'deliveryTax',
          },
        }

        if (deliveryTaxIndex > -1) {
          acc[deliveryTaxIndex] = deliveryTaxDiff
        } else {
          acc.push(deliveryTaxDiff)
        }
      }

      return acc
    }, cloneDeep(this.originalStatusObject.prices) || ([] as PriceStatus[]))
  }

  getMultilangDiff(original: MultiLangStringDto, modified: MultiLangStringDto) {
    return this.getObjectDiff(original, modified)
  }

  getLabellingDiff() {
    const labellingKeys = [
      'storageConditions',
      'ean13Code',
      'countryOfOriginDescription',
      'includeAverageWeightOnLabel',
      'legalTitle',
      'sellBy',
      'useBy',
      'includeNutritionalInformationOnLabel',
      'useByTurboChef',
      'sellByTurboChef',
      'canBeCookedInTurboChef',
      'productServes',
    ]

    return labellingKeys.reduce((acc, attribute) => {
      const mappedAttribute = attribute as keyof FoodVariantAttributes
      if (
        !isEqual(
          (this.originalVariant as FoodProductVariant).foodAttributes[mappedAttribute]?.value,
          (this.modifiedVariant as FoodProductVariant).foodAttributes[mappedAttribute]?.value,
        )
      ) {
        return {
          ...acc,
          [mappedAttribute]: this.generateFieldStatusObject(),
        }
      }

      return acc
    }, {})
  }

  getReportingDiff() {
    const reportingKeys = [
      'pluReportingName',
      'pluPrimaryCategoryID',
      'pluSecondaryCategoryID',
      'starKisProductCategoryID',
      'starKisProductSubCategoryID',
      'productRange',
    ]

    const attributesDiff = reportingKeys.reduce((acc, attribute) => {
      const mappedAttribute = attribute as keyof typeof this.originalVariant.commonAttributes

      if (
        !isEqual(
          this.originalVariant.commonAttributes[mappedAttribute],
          this.modifiedVariant.commonAttributes[mappedAttribute],
        )
      ) {
        return {
          ...acc,
          [mappedAttribute]: this.generateFieldStatusObject(),
        }
      }

      return acc
    }, {}) as VariantReviewStatus['reporting']

    if (this.originalVariant.isFoodVariant() && this.modifiedVariant.isFoodVariant()) {
      if (
        !isEqual(
          this.originalVariant.foodAttributes.parentProductSku,
          this.modifiedVariant.foodAttributes.parentProductSku,
        )
      ) {
        attributesDiff.parentProductSku = this.generateFieldStatusObject()
      }
    }

    return attributesDiff
  }

  getMarketingDiff(): VariantReviewStatus['marketing'] {
    const originalAvailability = VariantAvailability.fromCommonAttributes(
      this.originalVariant.commonAttributes,
    )

    const modifiedAvailability = VariantAvailability.fromCommonAttributes(
      this.modifiedVariant.commonAttributes,
    )

    let marketingDiff: VariantReviewStatus['marketing'] = {}

    if (!isEqual(this.originalVariant.name, this.modifiedVariant.name)) {
      marketingDiff.name = this.getMultilangDiff(
        this.originalVariant.name,
        this.modifiedVariant.name,
      )
    }

    if (!isEqual(this.originalVariant.description, this.modifiedVariant.description)) {
      marketingDiff.description = this.getMultilangDiff(
        this.originalVariant.description,
        this.modifiedVariant.description,
      )
    }

    if (!isEqual(originalAvailability, modifiedAvailability)) {
      marketingDiff = {
        ...marketingDiff,
        ...this.getAvailabilityDiff(originalAvailability, modifiedAvailability),
      }
    }

    if (
      !isEqual(
        this.originalVariant.commonAttributes.howToDisplay,
        this.modifiedVariant.commonAttributes.howToDisplay,
      )
    ) {
      marketingDiff.howToDisplay = this.generateFieldStatusObject()
    }

    return marketingDiff
  }

  getStatusObject(): VariantReviewStatus {
    return {
      marketing: merge(this.originalStatusObject.marketing || {}, this.getMarketingDiff()),
      reporting: merge(this.originalStatusObject.reporting || {}, this.getReportingDiff()),
      labelling: this.originalVariant.isFoodVariant()
        ? merge(this.originalStatusObject.labelling || {}, this.getLabellingDiff())
        : null,
      attributes: this.originalVariant.isBaristaVariant()
        ? merge(this.originalStatusObject.attributes || {}, this.getAttributesDiff())
        : null,
      prices: this.getPricingDiff(),
    }
  }
}
