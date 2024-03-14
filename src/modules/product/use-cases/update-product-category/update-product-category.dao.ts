import { Injectable } from '@nestjs/common'
import {
  ProductAddToCategoryAction,
  ProductRemoveFromCategoryAction,
} from '@commercetools/platform-sdk/dist/generated/models/product'

import { CommercetoolsContext } from '../../../commercetools/commercetools-context'

export interface IUpdateProductCategoryDao {}

@Injectable()
export class UpdateProductCategoryDao implements IUpdateProductCategoryDao {
  constructor(private readonly _ctContext: CommercetoolsContext) {}

  private createRemoveFromCategoryAction(categoryID: string): ProductRemoveFromCategoryAction {
    return {
      action: 'removeFromCategory',
      category: {
        id: categoryID,
        typeId: 'category',
      },
    }
  }

  private createAddToCategoryAction(categoryID: string): ProductAddToCategoryAction {
    return {
      action: 'addToCategory',
      category: {
        id: categoryID,
        typeId: 'category',
      },
    }
  }

  async addToCategory(sku: string, categoryID: string, version: number) {
    return this._ctContext.products
      .withKey({
        key: sku,
      })
      .post({
        body: {
          version,
          actions: [this.createAddToCategoryAction(categoryID)],
        },
      })
      .execute()
  }

  async removeFromCategory(sku: string, categoryID: string, version: number) {
    return this._ctContext.products
      .withKey({
        key: sku,
      })
      .post({
        body: {
          version,
          actions: [this.createRemoveFromCategoryAction(categoryID)],
        },
      })
      .execute()
  }

  async updateCategories(
    sku: string,
    opts: {
      idsToAdd: string[]
      idsToRemove: string[]
    },
    version: number,
  ) {
    const req = this._ctContext.products
      .withKey({
        key: sku,
      })
      .post({
        body: {
          version,
          actions: [
            ...opts.idsToAdd.map(this.createAddToCategoryAction),
            ...opts.idsToRemove.map(this.createRemoveFromCategoryAction),
          ],
        },
      })

    return req.execute()
  }
}
