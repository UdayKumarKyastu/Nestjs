import { CountryCode, CountryCodeParser } from '../../../shared/model/country-code'
import { StringAttribute } from '../base-attributes/string-attribute'

export class CountryAttribute extends StringAttribute<keyof typeof CountryCode> {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'country'

  private _tag = 'CountryAttribute'

  value: keyof typeof CountryCode

  constructor(countryCode: keyof typeof CountryCode) {
    super(countryCode)

    this.value = countryCode

    if (!CountryCode[this.value]) {
      throw new Error(
        `Expected CountryAttribute to receive one of country codes: ${Object.values(
          CountryCode,
        ).join('|')}. Received: ${countryCode}`,
      )
    }
  }

  asEnum() {
    return new CountryCodeParser().parse(this.value)
  }

  /**
   * TODO
   * This is for compatibility reasons - frontend still uses this label sometimes.
   * But soon we will have translations, so only code should be returned to frontend
   * and this should be removed
   */
  printEnglishName() {
    switch (this.value) {
      case CountryCode.UK:
        return 'United Kingdom'
      case CountryCode.US:
        return 'United States'
      case CountryCode.FR:
        return 'France'
      case CountryCode.HK:
        return 'Hong Kong'
    }
  }
}
