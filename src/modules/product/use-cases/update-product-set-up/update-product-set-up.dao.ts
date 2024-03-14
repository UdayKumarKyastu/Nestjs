import { Injectable } from '@nestjs/common'
import { ProductUpdateAction } from '@commercetools/platform-sdk'

import { CommercetoolsContext } from '../../../commercetools/commercetools-context'

import { ProductSetUpEditableFields } from './product-set-up-editable-fields'

export interface IUpdateProductSetUpDao {
  updateProductSetUpAttributes(
    sku: string,
    baristaAttributes: ProductSetUpEditableFields,
    version: number,
  ): Promise<void>
}

@Injectable()
export class UpdateProductSetUpDao implements IUpdateProductSetUpDao {
  constructor(private readonly _ctContext: CommercetoolsContext) {}

  private resolveActions(
    sku: string,
    baristaAttributes: ProductSetUpEditableFields,
  ): ProductUpdateAction[] {
    const keys = new Set<keyof ProductSetUpEditableFields>([
      'requiresIceMachine',
      'canHaveVariants',
      'canAddWhippedCream',
      'canAddSyrup',
      'canAddExtraShot',
      'requiresBlender',
    ])

    return Array.from(keys).map((key) => ({
      sku,
      action: 'setAttributeInAllVariants',
      name: key,
      value: baristaAttributes[key],
    }))
  }

  async updateProductSetUpAttributes(
    sku: string,
    baristaAttributes: ProductSetUpEditableFields,
    version: number,
  ) {
    const actions = this.resolveActions(sku, baristaAttributes)

    await this._ctContext.products
      .withKey({ key: sku })
      .post({
        body: {
          version: version,
          actions: actions,
        },
      })
      .execute()
  }
}
