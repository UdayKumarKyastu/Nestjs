import { DateAttribute } from './date-attribute'

describe('DateAttribute', function () {
  it('Throws if invalid date provided to constructor', () => {
    expect(() => new DateAttribute('foo')).toThrow()
    //@ts-expect-error expect to throw in test
    expect(() => new DateAttribute(null)).toThrow()
  })

  it('Accepts Date as param', () => {
    const attr = new DateAttribute(new Date())

    expect(attr).toBeDefined()
    expect(attr.value).toBeInstanceOf(Date)
  })

  it('Accepts IsoString as param and transforms to Date', () => {
    const attr = new DateAttribute(new Date().toISOString())

    expect(attr).toBeDefined()
    expect(attr.value).toBeInstanceOf(Date)
  })
})
