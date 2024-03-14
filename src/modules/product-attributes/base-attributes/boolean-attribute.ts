import { AbstractAttribute } from './abstract-attribute'

export class BooleanAttribute extends AbstractAttribute<boolean> {
  static COMMERCE_TOOLS_ATTR_NAME: string

  public value: boolean

  constructor(value: boolean) {
    super()

    if (typeof value !== 'boolean') {
      throw new Error(`Expected BooleanAttribute value to be boolean, received: ${value}`)
    }

    this.value = value
  }

  toJSON() {
    return {
      value: this.value,
    }
  }

  toString() {
    return `${this.value}`
  }
}
