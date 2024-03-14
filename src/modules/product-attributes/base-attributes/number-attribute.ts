import { AbstractAttribute } from './abstract-attribute'

export class NumberAttribute extends AbstractAttribute<number> {
  static readonly COMMERCE_TOOLS_ATTR_NAME: string

  public value: number

  constructor(value: number) {
    super()

    if (typeof value !== 'number') {
      throw new Error(`Expected NumberAttribute value to be number, received: ${value}`)
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
