import { Attribute, Price } from '@commercetools/platform-sdk'

import { CommonProductVariantAttributes } from '../product-attributes/common-product-variant-attributes'
import { FoodVariantAttributes } from '../product-attributes/food-variant-attributes'
import { BaristaBeverageVariantAttributes } from '../product-attributes/barista-beverage-variant-attributes'
import { Sku } from '../../shared/model/sku'
import { MultilangString } from '../product/logic/models/multilang-string'

export abstract class AbstractProductVariant {
  private readonly attributes: Attribute[]

  sku: Sku
  commonAttributes: CommonProductVariantAttributes
  name: MultilangString
  description: MultilangString
  prices: Price[]

  protected constructor(
    attributes: Attribute[],
    sku: Sku,
    name: MultilangString,
    description: MultilangString,
    prices: Price[],
  ) {
    this.attributes = attributes

    this.commonAttributes = new CommonProductVariantAttributes(attributes)
    this.sku = sku
    this.name = name
    this.description = description
    this.prices = prices
  }

  abstract isFoodVariant(): boolean
  abstract isBaristaVariant(): boolean
}

export class FoodProductVariant extends AbstractProductVariant {
  private _tag = 'FoodProductVariant'

  foodAttributes: FoodVariantAttributes

  private constructor(
    attributes: Attribute[],
    sku: Sku,
    name: MultilangString,
    description: MultilangString,
    prices: Price[],
  ) {
    super(attributes, sku, name, description, prices)

    this.foodAttributes = new FoodVariantAttributes(attributes)
  }

  isBaristaVariant(): this is BaristaProductVariant {
    return false
  }

  isFoodVariant(): this is FoodProductVariant {
    return true
  }

  static create(params: {
    sku: Sku
    ctAttributes: Attribute[]
    name: MultilangString
    description: MultilangString
    prices: Price[]
  }): FoodProductVariant {
    return new FoodProductVariant(
      params.ctAttributes,
      params.sku,
      params.name,
      params.description,
      params.prices,
    )
  }
}

export class BaristaProductVariant extends AbstractProductVariant {
  private _tag = 'BaristaProductVariant'

  baristaAttributes: BaristaBeverageVariantAttributes

  private constructor(
    attributes: Attribute[],
    sku: Sku,
    name: MultilangString,
    description: MultilangString,
    prices: Price[],
  ) {
    super(attributes, sku, name, description, prices)

    this.baristaAttributes = new BaristaBeverageVariantAttributes(attributes)
  }

  isBaristaVariant(): this is BaristaProductVariant {
    return true
  }

  isFoodVariant(): this is FoodProductVariant {
    return false
  }

  static create(params: {
    sku: Sku
    ctAttributes: Attribute[]
    name: MultilangString
    description: MultilangString
    prices: Price[]
  }): BaristaProductVariant {
    return new BaristaProductVariant(
      params.ctAttributes,
      params.sku,
      params.name,
      params.description,
      params.prices,
    )
  }
}
