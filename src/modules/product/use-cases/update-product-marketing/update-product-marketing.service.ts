import { Inject, Injectable } from '@nestjs/common'

import { CtProductDao } from '../../../ct-product/ct-product.dao'
import { IProductMetaDao, ProductMetaDao } from '../../dao/product-meta.dao'
import { MultilangString } from '../../logic/models/multilang-string'

import { UpdateProductMarketingDto } from './update-product-marketing.dto'

@Injectable()
export class UpdateProductMarketingService {
  constructor(
    private readonly _productDao: CtProductDao,
    @Inject(ProductMetaDao) private readonly _productMetaDao: IProductMetaDao,
  ) {}

  async update(sku: string, body: UpdateProductMarketingDto) {
    const product = await this._productDao.getOneProductBySkuOrThrow(sku)

    return this._productMetaDao.updateMeta(
      sku,
      product.version,
      MultilangString.fromDto(body.name),
      MultilangString.fromDto(body.description),
    )
  }
}
