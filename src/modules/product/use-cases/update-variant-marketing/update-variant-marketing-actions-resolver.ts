import { ProductUpdateAction } from '@commercetools/platform-sdk'
import { Injectable } from '@nestjs/common'

import { Time } from '../../../../shared/Time'
import { ProductTypeKey } from '../../../product-type/product-type-key'
import { IsoDateTimeString } from '../../logic/models/iso-date-time-string'
import { VariantMarketing } from '../../logic/models/variant-marketing'

interface CurrentOptionalFieldsValues {
  liveFrom: IsoDateTimeString | null
  liveTo: IsoDateTimeString | null
  newUntil: IsoDateTimeString | null
}

@Injectable()
export class UpdateVariantMarketingActionsResolver {
  resolveActions(
    variantSku: string,
    productType: ProductTypeKey,
    variantMarketing: VariantMarketing,
    currentOptionalFieldsValues: CurrentOptionalFieldsValues,
    isMaster: boolean,
  ): ProductUpdateAction[] {
    const actions: ProductUpdateAction[] = [
      {
        action: 'setAttribute',
        name: 'availableForCollection',
        sku: variantSku,
        value: variantMarketing.availableForClickAndCollect,
      },
      {
        action: 'setAttribute',
        name: 'availableForPretDelivers',
        sku: variantSku,
        value: variantMarketing.availableForPretDelivers,
      },
      {
        action: 'setAttribute',
        name: 'availableForOutposts',
        sku: variantSku,
        value: variantMarketing.availableForOutposts,
      },
      {
        action: 'setAttribute',
        name: 'visible',
        sku: variantSku,
        value: variantMarketing.isLive,
      },
      {
        action: 'setAttribute',
        name: 'visibleOnDeliveryWebsite',
        sku: variantSku,
        value: variantMarketing.visibleOnDeliveryWebsite,
      },
      {
        action: 'setAttribute',
        name: 'chefSpecial',
        sku: variantSku,
        value: variantMarketing.isChefsSpecial,
      },
      {
        action: 'setAttribute',
        name: 'displayAsNew',
        sku: variantSku,
        value: variantMarketing.displayAsNew.isDisplayed,
      },
      {
        action: 'setAttribute',
        name: 'howToDisplay',
        sku: variantSku,
        value: variantMarketing.howToDisplayKeys,
      },
      {
        action: 'setAttribute',
        name: 'pretDeliversAvailableAllDay',
        sku: variantSku,
        value: variantMarketing.availableAllDay,
      },
      {
        action: 'setAttribute',
        name: 'pretDeliversAvailableForLunch',
        sku: variantSku,
        value: variantMarketing.availableForLunch,
      },
      {
        action: 'setAttribute',
        name: 'description',
        sku: variantSku,
        value: variantMarketing.description.toPersistence(),
      },
    ]

    const productGroupActions: ProductUpdateAction[] = [
      {
        action: 'changeName',
        name: variantMarketing.name.toPersistence(),
      },
      {
        action: 'setDescription',
        description: variantMarketing.description.toPersistence(),
      },
    ]

    const baristaVariantActions: ProductUpdateAction[] = [
      {
        action: 'setAttribute',
        name: 'variantName',
        sku: variantSku,
        value: variantMarketing.name.toPersistence(),
      },
    ]

    if (productType === ProductTypeKey.BaristaBeverage) {
      actions.push(...baristaVariantActions)

      if (isMaster) {
        actions.push(...productGroupActions)
      }
    } else {
      actions.push(...productGroupActions)
    }

    if (currentOptionalFieldsValues.newUntil !== variantMarketing.displayAsNew.until) {
      const updateNewUntilAction: ProductUpdateAction = {
        action: 'setAttribute',
        name: 'newUntil',
        sku: variantSku,
        value: Time.buildStringDate(variantMarketing.displayAsNew.until),
      }
      actions.push(updateNewUntilAction)
    }

    return actions
  }
}
