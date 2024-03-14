import { Injectable } from '@nestjs/common'
import { CategoryReference } from '@commercetools/platform-sdk'

import { MultilangString } from '../product/logic/models/multilang-string'
import { CategoryListItemDto } from '../../shared/dto/category-list-item.dto'

import { CategoriesService } from './categories.service'

export interface ICategoryTreeBuilderService {
  buildCategoriesListsDtoFromReferences(
    categoryReferences: CategoryReference[],
  ): Promise<CategoryListItemDto[][]>
}

@Injectable()
export class CategoryNestedListBuilderService implements ICategoryTreeBuilderService {
  constructor(private readonly _categoriesService: CategoriesService) {}

  async buildCategoriesListsDtoFromReferences(
    categoryReferences: CategoryReference[],
  ): Promise<CategoryListItemDto[][]> {
    const lists = categoryReferences.map((ref) => [
      ...(ref.obj?.ancestors || []).map((ancestor) => ancestor.id),
      ref.id,
    ])

    const allCategories = await this._categoriesService.getAllCategoriesAsList()

    return lists.map((ids) =>
      ids.map((id) => {
        const category = allCategories.find((cat) => cat.id === id)!

        return {
          id: category.id!,
          key: category.key!,
          name: new MultilangString(category.name!).toDto(),
        }
      }),
    )
  }
}
