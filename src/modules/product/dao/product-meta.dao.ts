import { Injectable } from '@nestjs/common'
import { ProductSetDescriptionAction } from '@commercetools/platform-sdk'
import { ProductChangeNameAction } from '@commercetools/platform-sdk/dist/generated/models/product'

import { CommercetoolsContext } from '../../commercetools/commercetools-context'
import { MultilangString } from '../logic/models/multilang-string'

export interface IProductMetaDao {
  updateMeta(
    sku: string,
    version: number,
    name: MultilangString,
    description: MultilangString,
  ): Promise<void>
}

@Injectable()
export class ProductMetaDao implements IProductMetaDao {
  constructor(private readonly _ctContext: CommercetoolsContext) {}

  async updateMeta(
    sku: string,
    version: number,
    name: MultilangString,
    description: MultilangString,
  ): Promise<void> {
    const changeNameAction: ProductChangeNameAction = {
      action: 'changeName',
      staged: true,
      name: name.toPersistence(),
    }

    const setDescriptionAction: ProductSetDescriptionAction = {
      action: 'setDescription',
      description: description.toPersistence(),
      staged: true,
    }

    return this._ctContext.products
      .withKey({ key: sku })
      .post({
        body: {
          version,
          actions: [changeNameAction, setDescriptionAction],
        },
      })
      .execute()
      .then()
  }
}
