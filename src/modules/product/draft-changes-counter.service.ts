import { Injectable } from '@nestjs/common'
import { ProductData } from '@commercetools/platform-sdk'

import { ProductVariantChangesCounter } from '../product-variant/product-variant-changes-counter'
import { BaristaProductVariant, FoodProductVariant } from '../product-variant/product-variant'

import { ProductGroupChangesCounter } from './product-group-changes-counter'

@Injectable()
export class DraftChangesCounterService {
  compareProduct(productDto: ProductData, draftChangesDto: ProductData): number {
    const productGroupChangesCounter = new ProductGroupChangesCounter(productDto, draftChangesDto)

    return productGroupChangesCounter.countChanges()
  }

  compareProductSetUp(productDto: ProductData, draftChangesDto: ProductData): number {
    const productGroupChangesCounter = new ProductGroupChangesCounter(productDto, draftChangesDto)

    return productGroupChangesCounter.compareSetUp()
  }

  compareProductCategories(productDto: ProductData, draftChangesDto: ProductData): number {
    const productGroupChangesCounter = new ProductGroupChangesCounter(productDto, draftChangesDto)

    return productGroupChangesCounter.compareCategories()
  }

  compareVariant(
    liveVariant: FoodProductVariant | BaristaProductVariant,
    draftVariant: FoodProductVariant | BaristaProductVariant,
  ) {
    const counter = new ProductVariantChangesCounter(liveVariant, draftVariant)

    return counter.countChanges()
  }

  compareVariantMarketing(
    liveVariant: FoodProductVariant | BaristaProductVariant,
    draftVariant: FoodProductVariant | BaristaProductVariant,
  ) {
    const counter = new ProductVariantChangesCounter(liveVariant, draftVariant)

    return (
      counter.countName() +
      counter.countDescription() +
      counter.countAvailability() +
      counter.countHowToDisplay()
    )
  }

  compareVariantReporting(
    liveVariant: FoodProductVariant | BaristaProductVariant,
    draftVariant: FoodProductVariant | BaristaProductVariant,
  ) {
    const counter = new ProductVariantChangesCounter(liveVariant, draftVariant)

    return counter.countReporting()
  }

  compareVariantAttributes(
    liveVariant: FoodProductVariant | BaristaProductVariant,
    draftVariant: FoodProductVariant | BaristaProductVariant,
  ) {
    const counter = new ProductVariantChangesCounter(liveVariant, draftVariant)

    return counter.countBaristaAttributes()
  }

  compareVariantPricing(
    liveVariant: FoodProductVariant | BaristaProductVariant,
    draftVariant: FoodProductVariant | BaristaProductVariant,
  ) {
    const counter = new ProductVariantChangesCounter(liveVariant, draftVariant)

    return counter.countPrices()
  }

  compareVariantLabelling(
    liveVariant: FoodProductVariant | BaristaProductVariant,
    draftVariant: FoodProductVariant | BaristaProductVariant,
  ) {
    const counter = new ProductVariantChangesCounter(liveVariant, draftVariant)

    return counter.countLabelling()
  }

  compareVariantAvailability(
    liveVariant: FoodProductVariant | BaristaProductVariant,
    draftVariant: FoodProductVariant | BaristaProductVariant,
  ) {
    const counter = new ProductVariantChangesCounter(liveVariant, draftVariant)

    return counter.countAvailability()
  }
}
