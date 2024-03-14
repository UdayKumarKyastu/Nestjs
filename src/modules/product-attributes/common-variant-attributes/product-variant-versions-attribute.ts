import { AbstractAttribute } from '../base-attributes/abstract-attribute'

export class ProductVariantVersionsAttribute extends AbstractAttribute<string[]> {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'productVariantVersions'
  static readonly DEFAULT_VALUE = []

  private _tag = 'ProductVariantVersionsAttribute'

  value: string[]

  constructor(versionsIDs: string[]) {
    super()

    this.value = versionsIDs
  }

  toString() {
    return this.value.join()
  }

  toJSON() {
    return {
      value: this.value,
    }
  }
}
