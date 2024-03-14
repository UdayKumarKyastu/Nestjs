import {
  ProductUpdateAction,
  ProductVariant,
  ProductRemoveFromCategoryAction,
  ProductAddToCategoryAction,
} from '@commercetools/platform-sdk'

import { STATUS_TYPES } from '../../product/logic/review-status/models/status-types'
import { ProductGroup } from '../../../shared/model/product-group'
import { CtAttributesResolver } from '../../ct-utils/get-attribute-value'
import { ProductReviewStatus } from '../../product/logic/review-status/models/product-review-status'
import { ReviewStatusCounter } from '../../product/logic/review-status/review-status-counter/review-status-counter'
import { getAttributeByDtoKey } from '../../product-attributes/get-attribute-by-dto-key'

export class ProductChangesReverter {
  liveVariant: ProductVariant
  stagedVariant: ProductVariant
  getLiveAttributeValue

  constructor(
    private readonly reviewStatuses: ProductReviewStatus,
    private readonly product: ProductGroup,
  ) {
    const masterSku = this.product.getMasterVariant().sku!

    this.liveVariant = this.product!.getVariantBySkuOrThrow(masterSku)
    this.stagedVariant = this.product!.getStagedVariant(masterSku)!
    this.getLiveAttributeValue = CtAttributesResolver.constructAttributeValueGetter(
      this.liveVariant.attributes!,
    )
  }

  getActionsToRevert(): ProductUpdateAction[] {
    const actions: ProductUpdateAction[] = []

    if (ReviewStatusCounter.countSetupStatuses(this.reviewStatuses).rejected > 0) {
      Object.entries(this.reviewStatuses.setUp).map(([key, value]) => {
        if (value.status === STATUS_TYPES.rejected) {
          const attributeName = getAttributeByDtoKey(key)
          actions.push({
            action: 'setAttributeInAllVariants',
            name: attributeName,
            value: this.getLiveAttributeValue(attributeName),
          })
        }
      })
    }

    if (ReviewStatusCounter.countCategoriesStatuses(this.reviewStatuses).rejected > 0) {
      const idsToAdd: string[] = []
      const idsToRemove: string[] = []

      this.reviewStatuses.categories.forEach(({ value, status }) => {
        const liveCategoriesIds = this.product
          .getMasterData()
          .current.categories.map(({ id }) => id)

        if (status === STATUS_TYPES.rejected && liveCategoriesIds.includes(value[0])) {
          idsToAdd.push(value[0])
        }

        if (status === STATUS_TYPES.rejected && !liveCategoriesIds.includes(value[0])) {
          idsToRemove.push(value[0])
        }
      })

      const addActions: ProductAddToCategoryAction[] = idsToAdd.map((categoryID) => ({
        action: 'addToCategory',
        category: {
          id: categoryID,
          typeId: 'category',
        },
      }))

      const removeActions: ProductRemoveFromCategoryAction[] = idsToRemove.map((categoryID) => ({
        action: 'removeFromCategory',
        category: {
          id: categoryID,
          typeId: 'category',
        },
      }))

      actions.push(...addActions, ...removeActions)
    }

    return actions
  }
}
