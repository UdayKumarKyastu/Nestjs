import { cloneDeep, isEqual } from 'lodash'

import { ProductReviewStatus } from '../models/product-review-status'
import { ReviewStatusGenerator } from '../review-status-generator/review-status-generator'
import { Action } from '../models/update-action'
import { Area } from '../models/area'
import { User } from '../models/user'

import { getFieldStatusByAction } from './get-status-by-action'

export class ProductFieldStatusUpdater {
  reviewStatusGenerator: ReviewStatusGenerator

  constructor(private originalObject: ProductReviewStatus, private user?: User | null) {
    this.originalObject = cloneDeep(originalObject)
    this.reviewStatusGenerator = new ReviewStatusGenerator()
    this.user = user
  }

  updateSetupField(fieldName: keyof ProductReviewStatus['setUp'], action: Action) {
    const status = getFieldStatusByAction(action)

    this.originalObject.setUp[fieldName] = this.reviewStatusGenerator.generateFieldStatusObject(
      status,
      this.user,
    )

    return
  }

  updateCategoryField(categoryToUpdate: string[], action: Action) {
    const status = getFieldStatusByAction(action)

    const categoryIndex = this.originalObject.categories.findIndex((category) =>
      isEqual(category.value, categoryToUpdate),
    )

    this.originalObject.categories[categoryIndex] = {
      ...this.originalObject.categories[categoryIndex],
      ...this.reviewStatusGenerator.generateFieldStatusObject(status, this.user),
    }

    return
  }

  updateReviewStatusObject(tab: Area, fieldName: string, action: Action, fieldValue?: string[]) {
    if (tab === Area.SETUP) {
      this.updateSetupField(fieldName, action)
    }

    if (tab === Area.CATEGORIES) {
      this.updateCategoryField(fieldValue!, action)
    }

    return this.originalObject
  }
}
