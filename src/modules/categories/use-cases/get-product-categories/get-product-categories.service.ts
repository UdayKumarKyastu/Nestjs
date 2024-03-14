import { Injectable } from '@nestjs/common'

import { CtProductDao } from '../../../ct-product/ct-product.dao'
import { CategoriesService } from '../../categories.service'
import { CommonProductVariantAttributes } from '../../../product-attributes/common-product-variant-attributes'

import { GetProductCategoriesDto } from './get-product-categories.dto'

@Injectable()
export class GetProductCategoriesService {
  constructor(
    private readonly _productDao: CtProductDao,
    private readonly _categoriesService: CategoriesService,
  ) {}

  async getProductAvailableCategoriesTree(masterSku: string): Promise<GetProductCategoriesDto> {
    const product = await this._productDao.getOneProductBySkuOrThrow(masterSku)
    const attributes = product.masterData.current.masterVariant.attributes

    const { country } = new CommonProductVariantAttributes(attributes!)

    return {
      categories: await this._categoriesService
        .getAllCategoriesAsTree()
        .then((categories) => categories.filter((cat) => cat.key === country.value)),
    }
  }
}
