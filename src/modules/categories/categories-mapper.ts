import { Injectable } from '@nestjs/common'
import { Category } from '@commercetools/platform-sdk'

import { MultilangString } from '../product/logic/models/multilang-string'
import { CategoryTree } from '../../shared/dto/category-tree.dto'

@Injectable()
export class CategoriesMapper {
  /**
   * Based on https://stackoverflow.com/a/40732240
   */
  private mapListToTree(categories: CategoryTree[]): CategoryTree[] {
    const hashTable: Record<string, CategoryTree> = {}

    categories.forEach(
      (catWithParent) =>
        (hashTable[catWithParent.categoryID] = { ...catWithParent, categories: [] }),
    )

    const dataTree: CategoryTree[] = []

    categories.forEach((category) => {
      if (category.parentID) {
        hashTable[category.parentID].categories.push(hashTable[category.categoryID])
      } else {
        dataTree.push(hashTable[category.categoryID])
      }
    })

    return dataTree
  }

  mapCtListToTreeDto(categories: Category[]): CategoryTree[] {
    const asDtoList = categories.map((rawCategory): CategoryTree => {
      return {
        categoryID: rawCategory.id,
        parentID: rawCategory.parent?.id || null,
        categoryName: new MultilangString(rawCategory.name).toDto(),
        key: rawCategory.key!,
        categories: [],
      }
    })

    return this.mapListToTree(asDtoList)
  }
}
