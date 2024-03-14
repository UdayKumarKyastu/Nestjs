import { cloneDeep, isNumber } from 'lodash'

import {
  VariantVersionPortalFields,
  VersionCustomObjectPayload,
} from '../../model/version-custom-object'
import { VariantReviewStatus } from '../../../product/logic/review-status/models/variant-review-status'
import { STATUS_TYPES } from '../../../product/logic/review-status/models/status-types'
import { MultilangString } from '../../../product/logic/models/multilang-string'
import { SerializedVariantAvailabilityFields } from '../../../../shared/model/variant-availability'
import { SerializedVariantReportingFields } from '../../../product/logic/models/variant-reporting'
import { primitiveMarketingFields } from '../../../product/logic/review-status/review-status-generator/variant-review-status-generator'
import { BaristaAttributesDto } from '../../../../shared/dto/barista-attributes.dto'
import { VariantLabellingSerialized } from '../../../../shared/model/variant-labelling'
import { ChannelPrice } from '../../../../shared/model/channel-price'
import { ReviewStatusCounter } from '../../../product/logic/review-status/review-status-counter/review-status-counter'
import { MultiLangStringDto } from '../../../../shared/dto/multi-lang-string.dto'

export class VersionChangesReverter {
  constructor(
    private reviewStatuses: VariantReviewStatus,
    private version: VersionCustomObjectPayload,
  ) {}

  revertReportingRejectedChanges() {
    const reportingKeys = [
      'pluReportingName',
      'pluPrimaryCategoryID',
      'pluSecondaryCategoryID',
      'starKisProductCategoryID',
      'starKisProductSubCategoryID',
      'posID',
      'parentProductSku',
      'productRange',
    ]

    return reportingKeys.reduce((acc, attribute) => {
      const mappedAttribute = attribute as keyof SerializedVariantReportingFields

      const source =
        this.reviewStatuses.reporting?.[mappedAttribute]?.status === STATUS_TYPES.rejected
          ? 'approved'
          : 'draft'

      return {
        ...acc,
        [mappedAttribute]: this.version[source]?.reporting?.[mappedAttribute],
      }
    }, {}) as SerializedVariantReportingFields
  }

  revertAttributesRejectedChanges() {
    if (!this.reviewStatuses.attributes) {
      return this.version.draft?.baristaAttributes
    }

    const newAttributes = cloneDeep(this.version.draft?.baristaAttributes)!

    Object.keys(this.reviewStatuses.attributes).forEach((key) => {
      const mappedKey = key as keyof BaristaAttributesDto
      if (this.reviewStatuses.attributes![mappedKey]?.status === STATUS_TYPES.rejected) {
        newAttributes[mappedKey] = this.version.approved!.baristaAttributes![mappedKey]
      }
    })

    return newAttributes
  }

  revertLabellingRejectedChanges() {
    if (!this.reviewStatuses.labelling) {
      return this.version.draft?.labelling
    }

    // TODO:
    const newLabelling = cloneDeep(this.version.draft?.labelling)! as any

    Object.keys(this.reviewStatuses.labelling).forEach((key) => {
      const mappedKey = key as keyof VariantLabellingSerialized
      if (this.reviewStatuses.labelling![mappedKey]?.status === STATUS_TYPES.rejected) {
        newLabelling[mappedKey] = this.version.approved?.labelling![mappedKey]
      }
    })

    return newLabelling
  }

  revertPricingRejectedChanges() {
    if (!this.version.draft?.pricing) {
      return this.version.draft?.pricing
    }

    const newPricing = cloneDeep(this.version.draft?.pricing)

    this.reviewStatuses.prices?.forEach(({ status, value }) => {
      if (status === STATUS_TYPES.rejected) {
        const priceIndex = this.version.draft?.pricing?.findIndex(({ channelName }) => {
          return channelName === value.channelName
        })

        if (isNumber(priceIndex)) {
          newPricing[priceIndex] = new ChannelPrice({
            ...this.version.draft!.pricing![priceIndex],
            [value.field]: this.version.approved!.pricing![priceIndex][value.field],
          })
        }
      }
    })

    return newPricing
  }

  revertAvailabilityRejectedChanges() {
    const primitiveFieldsDiff = primitiveMarketingFields.reduce((acc, attribute) => {
      const mappedAttribute = attribute as keyof Omit<
        SerializedVariantAvailabilityFields,
        'displayAsNew'
      >

      const source =
        this.reviewStatuses.marketing?.[mappedAttribute]?.status === STATUS_TYPES.rejected
          ? 'approved'
          : 'draft'

      return {
        ...acc,
        [mappedAttribute]: this.version[source]?.availability?.[mappedAttribute],
      }
    }, {}) as SerializedVariantAvailabilityFields

    primitiveFieldsDiff.displayAsNew = {
      isDisplayed:
        this.reviewStatuses.marketing?.isDisplayed?.status === STATUS_TYPES.rejected
          ? this.version.approved!.availability!.displayAsNew.isDisplayed
          : this.version.draft!.availability!.displayAsNew.isDisplayed,
      until:
        this.reviewStatuses.marketing?.displayAsNewUntil?.status === STATUS_TYPES.rejected
          ? (this.version.approved!.availability! || {}).displayAsNew.until
          : this.version.draft!.availability!.displayAsNew.until,
    }

    return primitiveFieldsDiff
  }

  revertNameChanges() {
    const updatedName = { ...this.version.draft?.name } as MultiLangStringDto

    Object.entries(this.reviewStatuses.marketing?.name || {}).forEach(([key, value]) => {
      const mappedKey = key as keyof MultiLangStringDto

      if (value.status === STATUS_TYPES.rejected) {
        updatedName[mappedKey] = this.version.approved?.name?.[mappedKey] || ''
      }
    })

    return updatedName as MultilangString
  }

  revertDescriptionChanges() {
    const updatedDescription = { ...this.version.draft?.description } as MultiLangStringDto

    Object.entries(this.reviewStatuses.marketing?.description || {}).forEach(([key, value]) => {
      const mappedKey = key as keyof MultiLangStringDto

      if (value.status === STATUS_TYPES.rejected) {
        updatedDescription[mappedKey] = this.version.approved?.description?.[mappedKey] || ''
      }
    })

    return updatedDescription as MultilangString
  }

  revertRejectedChanges(): VariantVersionPortalFields {
    const updatedDraftFields = cloneDeep(this.version.draft)!

    if (ReviewStatusCounter.countMarketingStatuses(this.reviewStatuses).rejected > 0) {
      const updatedHowToDisplay =
        this.reviewStatuses.marketing?.howToDisplay?.status === STATUS_TYPES.rejected
          ? this.version.approved?.howToDisplay
          : this.version.draft?.howToDisplay

      updatedDraftFields.name = this.revertNameChanges()
      updatedDraftFields.description = this.revertDescriptionChanges()
      updatedDraftFields.availability = this.revertAvailabilityRejectedChanges()
      updatedDraftFields.howToDisplay = updatedHowToDisplay
    }

    if (ReviewStatusCounter.countReportingStatuses(this.reviewStatuses).rejected > 0) {
      updatedDraftFields.reporting = this.revertReportingRejectedChanges()
    }

    if (ReviewStatusCounter.countAttributesStatuses(this.reviewStatuses).rejected > 0) {
      updatedDraftFields.baristaAttributes = this.revertAttributesRejectedChanges()
    }

    if (ReviewStatusCounter.countLabellingStatuses(this.reviewStatuses).rejected > 0) {
      updatedDraftFields.labelling = this.revertLabellingRejectedChanges()
    }

    if (ReviewStatusCounter.countPricingStatuses(this.reviewStatuses).rejected > 0) {
      updatedDraftFields.pricing = this.revertPricingRejectedChanges()
    }

    return updatedDraftFields
  }
}
