import { Inject, Injectable } from '@nestjs/common'

import { CtProductDao } from '../../../ct-product/ct-product.dao'
import { ProductTypeKeyParser } from '../../../product-type/product-type-key'
import { IProductTaxationDao, ProductTaxationDao } from '../../product-taxation.dao.service'

import { UpdateProductTaxationDto } from './update-product-taxation.dto'

@Injectable()
export class UpdateProductTaxationService {
  constructor(
    private readonly _productDao: CtProductDao,
    @Inject(ProductTaxationDao) private readonly _taxationDao: IProductTaxationDao,
  ) {}

  async update(masterSku: string, body: UpdateProductTaxationDto) {
    const productGroup = await this._productDao.getOneProductBySkuOrThrow(masterSku)

    /**
     * Validate key, only barista and food can be updated
     */
    ProductTypeKeyParser.parseKey(productGroup.productType.obj?.key)

    return this._taxationDao.updateProductCategory(
      masterSku,
      body.taxCategoryId,
      productGroup.version,
    )
  }
}
