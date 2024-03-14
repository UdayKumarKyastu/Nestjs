import validator from 'validator'

export class TaxRate {
  private readonly __tax = 'tax'

  tax: number

  constructor(taxRate: number | string | { tax: number }) {
    const value = typeof taxRate === 'object' ? taxRate.tax : taxRate

    const valid = validator.isFloat(`${value}`, {
      min: 0,
      max: 1,
    })

    if (!valid) {
      throw new Error('Invalid tax format')
    }

    this.tax = parseFloat(`${value}`)
  }

  getValue() {
    return this.tax
  }

  toJSON() {
    return {
      tax: this.getValue(),
    }
  }
}
