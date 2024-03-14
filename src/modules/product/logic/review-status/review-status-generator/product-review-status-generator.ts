import { intersection, merge } from 'lodash'

import { ProductGroup } from '../../../../../shared/model/product-group'
import { BaristaBeverageProductSetup } from '../../models/barista-beverage-product-setup'
import { ProductReviewStatus } from '../models/product-review-status'

import { ReviewStatusGenerator } from './review-status-generator'

export class ProductReviewStatusGenerator extends ReviewStatusGenerator {
  constructor(
    private originalProduct: ProductGroup,
    private modifiedProduct: ProductGroup,
    private originalStatusObject: ProductReviewStatus = {} as ProductReviewStatus,
  ) {
    super()
  }

  getCategoriesDiff() {
    const originalCategoriesHashed = this.originalProduct
      .getMasterData()
      .current.categories.flat()
      .map((category) => category.id)
      .sort()

    const draftCategoriesHashed = this.modifiedProduct
      .getMasterData()
      .staged.categories.flat()
      .map((category) => category.id)
      .sort()

    const sharedCategories = intersection(originalCategoriesHashed, draftCategoriesHashed)

    const originalDiff = originalCategoriesHashed.filter((cat) => !sharedCategories.includes(cat))
    const draftDiff = draftCategoriesHashed.filter((cat) => !sharedCategories.includes(cat))

    return [...originalDiff, ...draftDiff].map((category) => ({
      ...this.generateFieldStatusObject(),
      value: [category],
    }))
  }

  getSetupDiff() {
    const originalSetup = new BaristaBeverageProductSetup(
      this.originalProduct.getMasterData().current.masterVariant.attributes,
    )
    const modifiedSetup = new BaristaBeverageProductSetup(
      this.modifiedProduct.getMasterData().staged.masterVariant.attributes,
    )

    const editableLiveSetup = {
      iceMachineRequired: originalSetup.requiresIceMachine,
      blenderRequired: originalSetup.requiresBlender,
      canHaveVariants: originalSetup.canHaveVariants,
      canAddSyrup: originalSetup.canAddSyrup,
      canAddExtraShot: originalSetup.canAddExtraShot,
      canAddWhippedCream: originalSetup.canAddWhippedCream,
    }

    const editableModifiedSetup = {
      iceMachineRequired: modifiedSetup.requiresIceMachine,
      blenderRequired: modifiedSetup.requiresBlender,
      canHaveVariants: modifiedSetup.canHaveVariants,
      canAddSyrup: modifiedSetup.canAddSyrup,
      canAddExtraShot: modifiedSetup.canAddExtraShot,
      canAddWhippedCream: modifiedSetup.canAddWhippedCream,
    }

    return this.getObjectDiff(editableLiveSetup, editableModifiedSetup)
  }

  getStatusObject() {
    return {
      categories: this.getCategoriesDiff(),
      setUp: this.originalProduct.isBaristaType()
        ? merge(this.originalStatusObject?.setUp, this.getSetupDiff())
        : null,
    }
  }
}
