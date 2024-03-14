import { Injectable } from '@nestjs/common'

import { CtProductDao } from '../../../ct-product/ct-product.dao'
import { ProductPublishStateValidator } from '../validate-product-publish-state/validate-product-publish-state'

import { UpdateProductCategoryDto } from './update-product-category.dto'
import { UpdateProductCategoryDao } from './update-product-category.dao'

@Injectable()
export class UpdateProductCategoryService {
  constructor(
    private readonly _productDao: CtProductDao,
    private readonly _updateProductCategoryDao: UpdateProductCategoryDao,
  ) {}

  async update(sku: string, dto: UpdateProductCategoryDto) {
    const product = await this._productDao.getOneProductBySkuOrThrow(sku)

    ProductPublishStateValidator.validateProductPublishState(product.masterData.published)

    const currentCategoriesIDs = product.masterData.staged.categories.map((cat) => cat.id)

    const toRemove = currentCategoriesIDs.filter(
      (currentCatID) => !dto.categoriesIDs.includes(currentCatID),
    )

    const toAdd = dto.categoriesIDs.filter(
      (newCategory) => !currentCategoriesIDs.includes(newCategory),
    )

    await this._updateProductCategoryDao.updateCategories(
      sku,
      {
        idsToAdd: toAdd,
        idsToRemove: toRemove,
      },
      product.version,
    )
  }
}
