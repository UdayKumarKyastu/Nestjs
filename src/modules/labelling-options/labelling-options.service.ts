import { Inject, Injectable } from '@nestjs/common'
import { orderBy } from 'lodash'

import { LabellingOptionsDto } from '../../shared/dto/labellingOptions.dto'
import { IProductTypeDao, ProductTypeDao } from '../product-type/product-type.dao'
import { ProductTypeKey } from '../product-type/product-type-key'
import { EnumOption } from '../product/logic/models/enum-option'
import { CommerceToolsAttributeOptionsGetter } from '../ct-utils/commercetools-attribute-options-getter'
import { UseByAttribute } from '../product-attributes/common-variant-attributes/use-by-attribute'
import { SellByAttribute } from '../product-attributes/common-variant-attributes/sell-by-attribute'
import { StorageConditionsAttribute } from '../product-attributes/food-variant-attributes/storage-conditions-attribute'
import { ProductServesAttribute } from '../product-attributes/common-variant-attributes/product-serves-attribute'

export interface ICanFindLabellingOptions {
  findUseBy(): Promise<EnumOption[]>
  findSellBy(): Promise<EnumOption[]>
  findStorageConditions(): Promise<EnumOption[]>
  findProductServes(): Promise<EnumOption[]>
  findAll(): Promise<LabellingOptionsDto>
}

/**
 * Only for Product type FOOD
 */
@Injectable()
export class LabellingOptionsService implements ICanFindLabellingOptions {
  private relatedProductType = ProductTypeKey.Food

  constructor(@Inject(ProductTypeDao) private readonly _productTypeDao: IProductTypeDao) {}

  async findUseBy(): Promise<EnumOption[]> {
    const productType = await this._productTypeDao.getProductDefinition(this.relatedProductType)

    return CommerceToolsAttributeOptionsGetter.getAttributeOptions('enum')(productType.attributes!)(
      UseByAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )
  }

  async findSellBy(): Promise<EnumOption[]> {
    const productType = await this._productTypeDao.getProductDefinition(this.relatedProductType)

    return CommerceToolsAttributeOptionsGetter.getAttributeOptions('enum')(productType.attributes!)(
      SellByAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )
  }

  async findStorageConditions(): Promise<EnumOption[]> {
    const productType = await this._productTypeDao.getProductDefinition(this.relatedProductType)

    return CommerceToolsAttributeOptionsGetter.getAttributeOptions('enum')(productType.attributes!)(
      StorageConditionsAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )
  }

  async findProductServes(): Promise<EnumOption[]> {
    const productType = await this._productTypeDao.getProductDefinition(this.relatedProductType)

    return CommerceToolsAttributeOptionsGetter.getAttributeOptions('enum')(productType.attributes!)(
      ProductServesAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )
  }

  async findAll(): Promise<LabellingOptionsDto> {
    const results = await Promise.all([
      this.findUseBy(),
      this.findSellBy(),
      this.findStorageConditions(),
      this.findProductServes(),
    ])

    return {
      useBy: results[0],
      sellBy: results[1],
      instructionsForUse: results[2],
      productServes: orderBy(results[3], ({ key }) => parseInt(key)),
    }
  }
}
