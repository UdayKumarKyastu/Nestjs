import { TaxRate } from './tax-rate'

describe('TaxRate value object', function () {
  it('Can construct from its own parsed', () => {
    const t0 = JSON.parse(JSON.stringify(new TaxRate(1)))
    const t1 = new TaxRate(t0)

    expect(t1.getValue()).toBe(1)
  })

  it('Can construct with rate 0', () => {
    const t1 = new TaxRate(0)
    const t2 = new TaxRate('0')

    expect(t1.getValue()).toEqual(0)
    expect(t2.getValue()).toEqual(0)
  })

  it('Can construct with rate 1', () => {
    const t1 = new TaxRate(1)
    const t2 = new TaxRate('1')

    expect(t1.getValue()).toEqual(1)
    expect(t2.getValue()).toEqual(1)
  })

  it.each([
    ['0.01', 0.01],
    ['0.09', 0.09],
    ['0.3', 0.3],
    ['0.99', 0.99],
  ])(`Can construct with input %s to have value %f`, (input, output) => {
    const t = new TaxRate(input)

    expect(t.getValue()).toEqual(output)
  })

  it('Throws if value is negative', () => {
    expect(() => new TaxRate(-1)).toThrow()
  })

  it('Throws if value is above 1 (100%)', () => {
    expect(() => new TaxRate(1.01)).toThrow()
    expect(() => new TaxRate(1.1)).toThrow()
    expect(() => new TaxRate(100)).toThrow()
    expect(() => new TaxRate(50)).toThrow()
  })

  it('Stringifies to preserve tax rate', () => {
    expect(JSON.parse(JSON.stringify(new TaxRate(0.5)))).toEqual({ tax: 0.5 })
  })
})
