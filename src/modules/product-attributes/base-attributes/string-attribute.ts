import { AbstractAttribute } from './abstract-attribute'

export class StringAttribute<T extends string = string> extends AbstractAttribute<T> {
  static readonly COMMERCE_TOOLS_ATTR_NAME: string

  public value: T

  constructor(value: T) {
    super()

    if (typeof value !== 'string') {
      throw new Error(
        `StringAttribute expects typeof "string" in constructor. Received ${JSON.stringify(value)}`,
      )
    }

    this.value = value
  }

  toJSON() {
    return {
      value: this.value,
    }
  }

  toString() {
    return this.value
  }

  sameValueAs(otherValue: string) {
    return this.value === otherValue
  }
}
