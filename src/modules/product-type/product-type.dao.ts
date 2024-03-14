import { Injectable } from '@nestjs/common'
import { ProductType } from '@commercetools/platform-sdk/dist/generated/models/product-type'

import { CommercetoolsContext } from '../commercetools/commercetools-context'

import { ProductTypeKey } from './product-type-key'

export interface IProductTypeDao {
  getProductDefinition(type: ProductTypeKey): Promise<ProductType>
  getFoodProductTypeDefinition(): Promise<ProductType>
  getBaristaProductTypeDefinition(): Promise<ProductType>
}

@Injectable()
export class ProductTypeDao implements IProductTypeDao {
  constructor(private readonly _ctContext: CommercetoolsContext) {}

  getBaristaProductTypeDefinition() {
    return this._ctContext.productTypes
      .get({
        queryArgs: {
          where: `key = "${ProductTypeKey.BaristaBeverage}"`,
        },
      })
      .execute()
      .then((result) => result.body.results[0])
  }

  getFoodProductTypeDefinition() {
    return this._ctContext.productTypes
      .get({
        queryArgs: {
          where: `key = "${ProductTypeKey.Food}"`,
        },
      })
      .execute()
      .then((result) => result.body.results[0])
  }

  getProductDefinition(type: ProductTypeKey) {
    switch (type) {
      case ProductTypeKey.Food:
        return this.getFoodProductTypeDefinition()
      case ProductTypeKey.BaristaBeverage:
        return this.getBaristaProductTypeDefinition()
    }
  }
}
