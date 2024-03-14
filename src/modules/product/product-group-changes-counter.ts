import { difference, intersection } from 'lodash'
import { ProductData, LocalizedString } from '@commercetools/platform-sdk'

import { BaristaBeverageProductSetup } from '../product/logic/models/barista-beverage-product-setup'

export class ProductGroupChangesCounter {
  constructor(private productData: ProductData, private draftChangesProductData: ProductData) {}

  // todo make util
  private compareMultiLangString(multiLang1: LocalizedString, multiLang2: LocalizedString) {
    return Object.keys(multiLang1).reduce<number>((changesAcc, keyName) => {
      const assertKey = keyName as keyof LocalizedString

      return multiLang1[assertKey] !== multiLang2[assertKey] ? changesAcc + 1 : changesAcc
    }, 0)
  }

  compareNameAndDescription() {
    const descriptionDiff = this.compareMultiLangString(
      this.productData.description!,
      this.draftChangesProductData.description!,
    )

    const nameDiff = this.compareMultiLangString(
      this.productData.name,
      this.draftChangesProductData.name,
    )

    return descriptionDiff + nameDiff
  }

  compareCategories(): number {
    const originalCategories = this.productData.categories
    const draftCategories = this.draftChangesProductData.categories

    const originalCategoriesHashed = originalCategories.map((category) => category.id).sort()

    const draftCategoriesHashed = draftCategories.map((category) => category.id).sort()

    const sharedCategories = intersection(originalCategoriesHashed, draftCategoriesHashed)

    const originalDiff = originalCategoriesHashed.filter((cat) => !sharedCategories.includes(cat))
    const draftDiff = draftCategoriesHashed.filter((cat) => !sharedCategories.includes(cat))

    return originalDiff.length + draftDiff.length
  }

  compareSetUp(): number {
    const originalSetUp = new BaristaBeverageProductSetup(this.productData.masterVariant.attributes)
    const draftSetUp = new BaristaBeverageProductSetup(
      this.draftChangesProductData.masterVariant.attributes,
    )

    // Compare if both nulls
    if (originalSetUp === draftSetUp) {
      return 0
    }

    const originalAsArray = Object.entries(originalSetUp!).map(([key, value]) => `${key}:${value}`)
    const draftAsArray = Object.entries(draftSetUp!).map(([key, value]) => `${key}:${value}`)

    return difference(originalAsArray, draftAsArray).length
  }

  countChanges() {
    let changes = 0

    changes = changes += this.compareCategories()
    changes = changes += this.compareSetUp()

    return changes
  }
}
