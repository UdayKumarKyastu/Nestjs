import { Category } from '@commercetools/platform-sdk'

import { CategoryNestedListBuilderService } from './category-nested-list-builder.service'
import { CategoriesService } from './categories.service'
import { ICategoriesDao } from './categories.dao'
import { CategoriesMapper } from './categories-mapper'

const constructBaseCategory = (id: string, name: string, key: string): Category => ({
  id,
  name: { en: name },
  createdAt: new Date().toISOString(),
  lastModifiedAt: new Date().toISOString(),
  orderHint: '1',
  version: 1,
  ancestors: [],
  slug: {},
  key,
})

describe('CategoryTreeBuilderService', () => {
  let service: CategoryNestedListBuilderService
  let categoriesDao: ICategoriesDao

  beforeEach(() => {
    categoriesDao = {
      async getAllCategories(): Promise<Category[]> {
        return [
          constructBaseCategory('cat-1', 'Category 1', 'CAT1'),
          constructBaseCategory('cat-2', 'Category 2', 'CAT2'),
          constructBaseCategory('cat-3', 'Category 3', 'CAT3'),
          constructBaseCategory('cat-4', 'Category 4', 'CAT4'),
          constructBaseCategory('cat-5', 'Category 5', 'CAT5'),
          constructBaseCategory('cat-6', 'Category 6', 'CAT6'),
        ]
      },
    }

    service = new CategoryNestedListBuilderService(
      new CategoriesService(categoriesDao, new CategoriesMapper()),
    )
  })

  it('Can construct categories tree from references with ancestors and flat categories list', async () => {
    const result = await service.buildCategoriesListsDtoFromReferences([
      {
        id: 'cat-1',
        typeId: 'category',
        obj: constructBaseCategory('cat-1', 'Category 1', 'CAT1'),
      },
      {
        id: 'cat-2',
        typeId: 'category',
        obj: {
          ...constructBaseCategory('cat-2', 'Category 2', 'CAT2'),
          ancestors: [
            {
              id: 'cat-5',
              obj: undefined,
              typeId: 'category',
            },
            {
              id: 'cat-4',
              obj: undefined,
              typeId: 'category',
            },
            {
              id: 'cat-3',
              obj: undefined,
              typeId: 'category',
            },
          ],
        },
      },
    ])

    expect(result[0].length).toBe(1)
    expect(result[0][0].key).toBe('CAT1')

    expect(result[1]).toMatchInlineSnapshot(`
      Array [
        Object {
          "id": "cat-5",
          "key": "CAT5",
          "name": Object {
            "en-GB": "",
            "en-HK": "",
            "en-US": "",
            "fr-FR": "",
            "zh-HK": "",
          },
        },
        Object {
          "id": "cat-4",
          "key": "CAT4",
          "name": Object {
            "en-GB": "",
            "en-HK": "",
            "en-US": "",
            "fr-FR": "",
            "zh-HK": "",
          },
        },
        Object {
          "id": "cat-3",
          "key": "CAT3",
          "name": Object {
            "en-GB": "",
            "en-HK": "",
            "en-US": "",
            "fr-FR": "",
            "zh-HK": "",
          },
        },
        Object {
          "id": "cat-2",
          "key": "CAT2",
          "name": Object {
            "en-GB": "",
            "en-HK": "",
            "en-US": "",
            "fr-FR": "",
            "zh-HK": "",
          },
        },
      ]
    `)
  })
})
