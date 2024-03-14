import { AbstractAttribute } from './abstract-attribute'

interface CtEnumValue {
  key: string
  label: string
}

export class EnumAttribute extends AbstractAttribute<CtEnumValue> {
  static readonly COMMERCE_TOOLS_ATTR_NAME: string

  public value: CtEnumValue

  constructor(value: CtEnumValue) {
    super()

    this.value = value
  }

  toJSON() {
    return {
      value: this.value,
    }
  }

  toString() {
    return JSON.stringify(this.value)
  }
}
