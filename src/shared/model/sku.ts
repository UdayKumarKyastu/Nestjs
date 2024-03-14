export class Sku {
  private _tag = 'SKU'

  value: string

  constructor(sku: string) {
    this.value = sku
  }

  toString() {
    return this.value
  }

  toJSON() {
    return {
      value: this.value,
    }
  }
}
