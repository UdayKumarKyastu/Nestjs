export enum CountryCode {
  UK = 'UK',
  US = 'US',
  FR = 'FR',
  HK = 'HK',
}

export class CountryCodeParser {
  parse(code: string): CountryCode {
    const parsed = CountryCode[code as keyof typeof CountryCode]

    if (!parsed) {
      throw new Error(
        `Invalid country code provided. Expected ${Object.values(CountryCode)}, received: ${code}`,
      )
    }

    return parsed as CountryCode
  }
}
