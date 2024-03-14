import { cloneDeep } from 'lodash'

import {
  VariantReviewStatus,
  LabellingReviewStatus,
  BaristaAttributesReviewStatus,
  AvailabilityReviewStatus,
} from '../models/variant-review-status'
import { ReviewStatusGenerator } from '../review-status-generator/review-status-generator'
import { primitiveMarketingFields } from '../review-status-generator/variant-review-status-generator'
import { Action } from '../models/update-action'
import { Area } from '../models/area'
import { PricingFieldValue } from '../review-status.service'
import { LanguageCode } from '../../../../product/logic/models/multilang-string'
import { User } from '../models/user'

import { getFieldStatusByAction } from './get-status-by-action'

export class VariantFieldStatusUpdater {
  reviewStatusGenerator: ReviewStatusGenerator

  constructor(private originalObject: VariantReviewStatus, private user?: User | null) {
    this.originalObject = cloneDeep(originalObject)
    this.reviewStatusGenerator = new ReviewStatusGenerator()
    this.user = user
  }

  updateMarketingField(
    fieldName:
      | keyof Omit<VariantReviewStatus['marketing'], 'availability'>
      | keyof AvailabilityReviewStatus,
    action: Action,
    fieldValue?: LanguageCode,
  ) {
    const status = getFieldStatusByAction(action)

    if (fieldName === 'name') {
      this.originalObject.marketing.name = {
        [fieldValue!]: this.reviewStatusGenerator.generateFieldStatusObject(status, this.user),
      }

      return
    }

    if (fieldName === 'description') {
      this.originalObject.marketing.description = {
        [fieldValue!]: this.reviewStatusGenerator.generateFieldStatusObject(status, this.user),
      }

      return
    }

    if (fieldName === 'howToDisplay') {
      this.originalObject.marketing.howToDisplay =
        this.reviewStatusGenerator.generateFieldStatusObject(status, this.user)

      return
    }

    if (fieldName === 'isDisplayed') {
      this.originalObject.marketing![fieldName] =
        this.reviewStatusGenerator.generateFieldStatusObject(status, this.user)

      return
    }

    if (fieldName === 'displayAsNewUntil') {
      this.originalObject.marketing![fieldName] =
        this.reviewStatusGenerator.generateFieldStatusObject(status, this.user)

      return
    }

    if (primitiveMarketingFields.includes(fieldName)) {
      this.originalObject.marketing![fieldName] =
        this.reviewStatusGenerator.generateFieldStatusObject(status, this.user)

      return
    }
  }

  updateAttributesField(fieldName: keyof BaristaAttributesReviewStatus, action: Action) {
    const status = getFieldStatusByAction(action)

    ;(this.originalObject.attributes as BaristaAttributesReviewStatus)[fieldName] =
      this.reviewStatusGenerator.generateFieldStatusObject(status, this.user)
  }

  updateReportingField(fieldName: keyof VariantReviewStatus['reporting'], action: Action) {
    const status = getFieldStatusByAction(action)

    this.originalObject.reporting[fieldName] = this.reviewStatusGenerator.generateFieldStatusObject(
      status,
      this.user,
    )
  }

  updateLabellingField(fieldName: keyof LabellingReviewStatus, action: Action) {
    const status = getFieldStatusByAction(action)

    ;(this.originalObject.labelling as LabellingReviewStatus)[fieldName] =
      this.reviewStatusGenerator.generateFieldStatusObject(status, this.user)
  }

  updatePricingField(fieldName: string, action: Action, channelName: string) {
    const status = getFieldStatusByAction(action)

    const fieldIndex = this.originalObject.prices.findIndex(
      (price) => price.value.channelName === channelName && price.value.field === fieldName,
    )

    this.originalObject.prices[fieldIndex] = {
      ...this.originalObject.prices[fieldIndex],
      ...this.reviewStatusGenerator.generateFieldStatusObject(status, this.user),
    }
  }

  updateReviewStatusObject(
    tab: Area,
    fieldName: string,
    action: Action,
    fieldValue?: PricingFieldValue | LanguageCode,
  ) {
    switch (tab) {
      case Area.MARKETING:
        this.updateMarketingField(
          fieldName as keyof VariantReviewStatus & keyof AvailabilityReviewStatus,
          action,
          fieldValue as LanguageCode,
        )

        break
      case Area.REPORTING:
        this.updateReportingField(fieldName as keyof VariantReviewStatus['reporting'], action)

        break
      case Area.LABELLING:
        this.updateLabellingField(fieldName as keyof LabellingReviewStatus, action)

        break
      case Area.ATTRIBUTES:
        this.updateAttributesField(fieldName as keyof BaristaAttributesReviewStatus, action)

        break
      case Area.PRICING:
        this.updatePricingField(
          (fieldValue as PricingFieldValue).field,
          action,
          (fieldValue as PricingFieldValue).channelName,
        )

        break
    }

    return this.originalObject
  }
}
