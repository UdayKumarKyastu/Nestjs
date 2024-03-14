import { Injectable } from '@nestjs/common'
import { ProductSetAttributeAction } from '@commercetools/platform-sdk'

import { BaristaAttributesDto } from '../../../../shared/dto/barista-attributes.dto'
import { CommercetoolsContext } from '../../../commercetools/commercetools-context'

@Injectable()
export class UpdateVariantBaristaAttributesDao {
  constructor(private readonly _ctContext: CommercetoolsContext) {}

  /**
   * TODO: Make enum with CT fields mapping
   */
  private getActions(
    variantSku: string,
    attributes: BaristaAttributesDto,
  ): ProductSetAttributeAction[] {
    return [
      {
        action: 'setAttribute',
        name: 'isDecafPod',
        sku: variantSku,
        value: attributes.withDecafPods,
      },
      {
        action: 'setAttribute',
        name: 'isBlack',
        sku: variantSku,
        value: attributes.withoutMilk,
      },
      {
        action: 'setAttribute',
        name: 'milkIsSemiSkimmed',
        sku: variantSku,
        value: attributes.withSemiSkimmedMilk,
      },
      {
        action: 'setAttribute',
        name: 'milkIsSkimmed',
        sku: variantSku,
        value: attributes.withSkimmedMilk,
      },
      {
        action: 'setAttribute',
        name: 'milkIsOat',
        sku: variantSku,
        value: attributes.withOatMilk,
      },
      {
        action: 'setAttribute',
        name: 'milkIsRiceCoconut',
        sku: variantSku,
        value: attributes.withRiceCoconutMilk,
      },
      {
        action: 'setAttribute',
        name: 'milkIsSoya',
        sku: variantSku,
        value: attributes.withSoyMilk,
      },
    ]
  }

  async updateVariantBaristaAttributes(
    masterSku: string,
    variantSku: string,
    version: number,
    attributes: BaristaAttributesDto,
  ) {
    const actions = this.getActions(variantSku, attributes)

    return this._ctContext.products
      .withKey({
        key: masterSku,
      })
      .post({
        body: {
          version,
          actions: actions,
        },
      })
      .execute()
  }
}
