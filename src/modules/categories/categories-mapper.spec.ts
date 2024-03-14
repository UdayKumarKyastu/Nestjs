import { Category } from '@commercetools/platform-sdk'

import { DeepPartial } from '../../shared/deep-partial'

import { CategoriesMapper } from './categories-mapper'

const constructCategoryMock = (
  key: string,
  name: string,
  id: string,
  parentID?: string | undefined,
) => {
  return {
    key,
    name: { 'en-GB': name },
    parent: { id: parentID },
    id,
  } as DeepPartial<Category> as Category
}

const mockCategories: Category[] = [
  constructCategoryMock('UK', 'UK', 'uk-root'),
  constructCategoryMock('US', 'US', 'us-root'),
  constructCategoryMock('UK-Coffee', 'UK-Coffee', 'uk-coffee', 'uk-root'),
  constructCategoryMock('US-Coffee', 'US-Coffee', 'us-coffee', 'us-root'),
  constructCategoryMock('UK-Cold-Coffee', 'UK-Cold-Coffee', 'us-cold-coffee', 'uk-coffee'),
]

describe('GetProductCategoriesDao', () => {
  it('Maps raw categories into tree structure', async () => {
    const mapper = new CategoriesMapper()

    const result = await mapper.mapCtListToTreeDto(mockCategories)

    expect(result[0].key).toBe('UK')
    expect(result[1].key).toBe('US')
    expect(result[0].categories[0].key).toBe('UK-Coffee')
    expect(result[1].categories[0].key).toBe('US-Coffee')
    expect(result[0].categories[0].categories[0].key).toBe('UK-Cold-Coffee')
  })
})
