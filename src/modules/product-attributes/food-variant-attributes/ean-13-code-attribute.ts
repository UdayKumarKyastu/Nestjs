import validator from 'validator'

import { StringAttribute } from '../base-attributes/string-attribute'

export class Ean13CodeAttribute extends StringAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'ean13Code'

  private _tag = 'Ean13CodeAttribute'

  constructor(public value: string) {
    super(value)

    if (!validator.isEAN(value)) {
      throw new Error(`${value} is not valid EAN13 code`)
    }
  }

  static isValidEan(ean: string) {
    return validator.isEAN(ean)
  }
}
