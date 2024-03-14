import { CountryCode } from '../../../shared/model/country-code'

import { CountryAttribute } from './country-attribute'

describe('CountryAttribute', function () {
  it('Throws if invalid country provided in constructor', () => {
    // @ts-expect-error - TS checks if flag is enum, but it can be dynamic value
    expect(() => new CountryAttribute('foo')).toThrow()
  })

  it.each(Object.values(CountryCode) as CountryCode[])('constructs from value "%s"', (country) => {
    const attr = new CountryAttribute(country)

    expect(attr).toBeDefined()
    expect(attr.value).toBe(country)
  })
})
