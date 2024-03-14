import { VariantVersionsReferenceExtractor } from './variant-versions-reference-extractor'

const versionReferenceAttributeName = 'productVariantVersions'

describe('VariantVersionsReferenceExtractorService', function () {
  it('Return empty array if no references found', () => {
    const service = new VariantVersionsReferenceExtractor()

    const result1 = service.extractVersionsReferencesFromVariant({
      attributes: [
        {
          name: 'any other attr',
          value: 'foo',
        },
      ],
    })

    const result2 = service.extractVersionsReferencesFromVariant({
      attributes: [],
    })

    const result3 = service.extractVersionsReferencesFromVariant({
      attributes: undefined,
    })

    expect(result1).toEqual([])
    expect(result2).toEqual([])
    expect(result3).toEqual([])
    expect(result3).toEqual([])
  })

  it('Returns list of attribute IDs', () => {
    const service = new VariantVersionsReferenceExtractor()

    const result = service.extractVersionsReferencesFromVariant({
      attributes: [
        {
          name: versionReferenceAttributeName,
          value: [
            {
              typeId: 'key-value-document',
              id: 'REFERENCE_ID_1',
            },
            {
              typeId: 'key-value-document',
              id: 'REFERENCE_ID_2',
            },
          ],
        },
      ],
    })

    expect(result).toEqual(['REFERENCE_ID_1', 'REFERENCE_ID_2'])
  })
})
