import validator from 'validator'

export class DateAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME: string

  public value: Date

  constructor(value: string | Date) {
    if (typeof value === 'string' && !validator.isISO8601(value)) {
      throw new Error(`Expected ${value} to be valid Date string. Received: ${value}`)
    }

    if (!value) {
      throw new Error(`Expected ${value} to be valid Date. Received: ${value}`)
    }

    this.value = new Date(value)

    if (!this.value) {
      throw new Error(`Cant parse date. Received ${value} as param`)
    }
  }

  toJSON() {
    return {
      value: this.value.toISOString(),
    }
  }

  toString() {
    return this.value.toISOString()
  }
}
