import { VariantVersionCustomObject } from '../../variant-version/model/version-custom-object'
import { MultiLangStringMockFactory } from '../../product/logic/models/multilang-string'

export const versionMock: VariantVersionCustomObject = {
  id: '1e164521-1e41-4ca9-bc2a-513e399a5310',
  value: {
    hg: {
      liveFrom: '2020-01-01T10:00:00',
      hgCode: 'FP1234',
      lastUpdatedFromHG: '2020-01-01T10:00:00',
      ingredients: { 'en-GB': '' },
      name: 'name',
      version: 1,
      suitableForVegetarians: true,
      country: 'UK',
      localizedClaims: [],
      localizedContainsAllergens: [],
      nutritionals: [],
      averageWeight: 123,
      suitableForVegans: true,
      productCountry: 'UK',
      productId: {
        code: 'FP1234',
        version: '1',
      },
      hgRecipeStatus: 'Approved',
    },
    key: 'FP1234',
    hasDraftChanges: true,
    approved: {
      name: MultiLangStringMockFactory.createMultiLangString('name'),
    },
    draft: {
      name: MultiLangStringMockFactory.createMultiLangString('name draft'),
    },
  },
} as any as VariantVersionCustomObject
