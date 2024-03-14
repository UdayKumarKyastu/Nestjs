import { BadRequestException, Inject, Injectable } from '@nestjs/common'

import { CtProductDao } from '../../../ct-product/ct-product.dao'
import { ProductTypeKey, ProductTypeKeyParser } from '../../../product-type/product-type-key'
import { ProductPublishStateValidator } from '../validate-product-publish-state/validate-product-publish-state'

import { UpdateProductSetUpDto } from './update-product-set-up.dto'
import { IUpdateProductSetUpDao, UpdateProductSetUpDao } from './update-product-set-up.dao'
import { ProductSetUpEditableFieldsFactory } from './product-set-up-editable-fields'

@Injectable()
export class UpdateProductSetUpService {
  constructor(
    @Inject(UpdateProductSetUpDao) private readonly _updateProductSetUpDao: IUpdateProductSetUpDao,
    private readonly _productDao: CtProductDao,
  ) {}

  async update(sku: string, dto: UpdateProductSetUpDto) {
    const product = await this._productDao.getOneProductBySkuOrThrow(sku)

    ProductPublishStateValidator.validateProductPublishState(product.masterData.published)

    const productType = ProductTypeKeyParser.parseKey(product.productType.obj?.key)

    if (productType !== ProductTypeKey.BaristaBeverage) {
      throw new BadRequestException('SetUp can be only applied to Barista product')
    }

    await this._updateProductSetUpDao.updateProductSetUpAttributes(
      sku,
      ProductSetUpEditableFieldsFactory.fromUpdateSetupDto(dto),
      product.version,
    )
  }
}
