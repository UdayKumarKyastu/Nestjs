import { Inject, Injectable } from '@nestjs/common'

import { CategoriesDao, ICategoriesDao } from './categories.dao'
import { CategoriesMapper } from './categories-mapper'

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CategoriesDao) private readonly _categoriesDao: ICategoriesDao,
    private readonly _categoriesMapper: CategoriesMapper,
  ) {}

  async getAllCategoriesAsTree() {
    const categories = await this._categoriesDao.getAllCategories()

    return this._categoriesMapper.mapCtListToTreeDto(categories)
  }

  async getAllCategoriesAsList() {
    return this._categoriesDao.getAllCategories()
  }
}
