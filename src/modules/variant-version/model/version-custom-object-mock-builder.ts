import { MultiLangStringMockFactory } from '../../product/logic/models/multilang-string'

import { VersionCustomObjectPayload } from './version-custom-object'

export class VersionCustomObjectMockBuilder {
  private version: VersionCustomObjectPayload = {
    key: '',
    hg: {
      productCountry: 'UK',
      productId: {
        version: '1',
        code: 'FP123',
      },
      hgCode: 'FP123',
      version: 1,
      liveFrom: '2020-08-01',
      ingredients: MultiLangStringMockFactory.createMultiLangString('ingredients'),
      averageWeight: 123,
      lastUpdatedFromHG: '2020-07-01T10:00:00Z',
      name: 'TEST',
      suitableForVegans: true,
      nutritionals: [],
      localizedContainsAllergens: [],
      localizedClaims: [],
      country: 'UK',
      suitableForVegetarians: true,
      constituentItems: [],
      hgRecipeStatus: 'Approved',
      recipeType: [],
    },
  }

  constructor(versionCustomObject: Partial<VersionCustomObjectPayload> = {}) {
    this.version = {
      ...this.version,
      ...JSON.parse(JSON.stringify(versionCustomObject)),
    }
  }

  withHgProductCode(hgCode: string) {
    this.version.hg.hgCode = hgCode

    return this
  }

  withKey(key: string) {
    this.version.key = key

    return this
  }

  build() {
    return this.version
  }
}
