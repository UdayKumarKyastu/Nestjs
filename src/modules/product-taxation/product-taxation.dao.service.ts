import { Injectable } from '@nestjs/common'
import { ClientResponse, Product, TaxCategory } from '@commercetools/platform-sdk'
import { ProductSetTaxCategoryAction } from '@commercetools/platform-sdk/dist/generated/models/product'

import { CommercetoolsContext } from '../commercetools/commercetools-context'

export interface IProductTaxationDao {
  findAll(): Promise<TaxCategory[]>
  updateProductCategory(
    sku: string,
    taxCategoryId: string,
    version: number,
  ): Promise<ClientResponse<Product>>
}

@Injectable()
export class ProductTaxationDao implements IProductTaxationDao {
  constructor(private readonly _ctContext: CommercetoolsContext) {}

  findAll() {
    return this._ctContext.taxCategoriesProjections
      .get()
      .execute()
      .then((response) => {
        return response.body.results
      })
  }

  updateProductCategory(sku: string, taxCategoryId: string, version: number) {
    const action: ProductSetTaxCategoryAction = {
      action: 'setTaxCategory',
      taxCategory: {
        id: taxCategoryId,
        typeId: 'tax-category',
      },
    }

    return this._ctContext.products
      .withKey({ key: sku })
      .post({
        body: {
          version: version,
          actions: [action],
        },
      })
      .execute()
  }
}
