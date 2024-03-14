import { Inject, Injectable } from '@nestjs/common'

import { EnumOption } from '../product/logic/models/enum-option'
import { ProductTypeKey } from '../product-type/product-type-key'
import { CommerceToolsAttributeOptionsGetter } from '../ct-utils/commercetools-attribute-options-getter'
import { IProductTypeDao, ProductTypeDao } from '../product-type/product-type.dao'
import { HowToDisplayAttribute } from '../product-attributes/common-variant-attributes/how-to-display-attribute'

@Injectable()
export class VariantHowToDisplayDao {
  constructor(@Inject(ProductTypeDao) private readonly _productTypeDao: IProductTypeDao) {}

  async findAll(productTypeKey: ProductTypeKey): Promise<EnumOption[]> {
    const productType = await this._productTypeDao.getProductDefinition(productTypeKey)

    return CommerceToolsAttributeOptionsGetter.getAttributeOptions('set')(productType.attributes!)(
      HowToDisplayAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )
  }
}
