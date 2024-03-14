import { Inject, Injectable } from '@nestjs/common'
import { Category } from '@commercetools/platform-sdk'

import {
  CommercetoolsContext,
  IHasCtCategoriesBuilder,
} from '../commercetools/commercetools-context'

export interface ICategoriesDao {
  getAllCategories(): Promise<Category[]>
}

@Injectable()
export class CategoriesDao implements ICategoriesDao {
  constructor(@Inject(CommercetoolsContext) private readonly _ctContext: IHasCtCategoriesBuilder) {}

  getAllCategories(): Promise<Category[]> {
    return this._ctContext.categories
      .get({
        queryArgs: {
          /**
           * 500 is max limit for CT, we want all categories to be fetched
           */
          limit: 500,
        },
      })
      .execute()
      .then((c) => c.body.results)
  }
}
