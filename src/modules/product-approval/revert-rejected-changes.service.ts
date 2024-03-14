import { Injectable } from '@nestjs/common'
import { Product } from '@commercetools/platform-sdk'

import { CommercetoolsCustomObjectDao } from '../commercetools/commercetools-custom-object.dao'
import { ReviewStatusCounter } from '../product/logic/review-status/review-status-counter/review-status-counter'
import { ProductGroup } from '../../shared/model/product-group'
import { ProductReviewStatus } from '../product/logic/review-status/models/product-review-status'
import { CommercetoolsContext } from '../commercetools/commercetools-context'
import { CtProductDao } from '../ct-product/ct-product.dao'

import { VariantChangesReverter } from './variant-changes-reverter/variant-changes-reverter'
import { ProductChangesReverter } from './product-changes-reverter/product-changes-reverter'

export interface IRevertRejectedChangesService {
  revertRejectedChanges(masterSku: string, product: Product): Promise<void>
}

@Injectable()
export class RevertRejectedChangesService implements IRevertRejectedChangesService {
  product: ProductGroup | null

  constructor(
    private readonly _commerceToolsCustomObjectService: CommercetoolsCustomObjectDao,
    private readonly _ctContext: CommercetoolsContext,
    private readonly _productDao: CtProductDao,
  ) {
    this.product = null
  }

  async revertRejectedChanges(masterSku: string): Promise<void> {
    const product = await this._productDao.getOneProductBySkuOrThrow(masterSku)
    const productGroup = new ProductGroup(product)
    const currentVersion = product.version

    const allVariants = productGroup.getMasterAndAllVariants()

    const productCustomObjectKey = `${masterSku}-product-reviewStatus`

    const productReviewStatusObject =
      await this._commerceToolsCustomObjectService.getCustomObjectByKey(productCustomObjectKey)

    const productReviewStatuses = productReviewStatusObject?.value as ProductReviewStatus

    if (productReviewStatusObject) {
      if (ReviewStatusCounter.countProductStatuses(productReviewStatuses).rejected > 0) {
        const productActions = new ProductChangesReverter(
          productReviewStatuses,
          productGroup,
        ).getActionsToRevert()

        await this._ctContext.products
          .withKey({ key: masterSku })
          .post({
            body: {
              version: currentVersion,
              actions: productActions,
            },
          })
          .execute()
      }

      await this._commerceToolsCustomObjectService.writeCustomObject(
        productCustomObjectKey,
        productReviewStatusObject!.container,
        {},
      )
    }

    await Promise.all(
      allVariants.map(async (variant) => {
        const variantStatusObjectKey = `${variant.sku}-variant-reviewStatus`
        const reviewStatusesCustomObject =
          await this._commerceToolsCustomObjectService.getCustomObjectByKey(variantStatusObjectKey)

        const reviewStatuses = reviewStatusesCustomObject?.value

        if (reviewStatuses) {
          if (ReviewStatusCounter.countVariantStatuses(reviewStatuses).rejected > 0) {
            const actions = new VariantChangesReverter(
              reviewStatuses,
              productGroup,
              variant.sku!,
            ).getActionsToRevert()

            await this._ctContext.products
              .withKey({
                key: masterSku,
              })
              .post({
                body: {
                  version: currentVersion,
                  actions: actions,
                },
              })
              .execute()
          }

          await this._commerceToolsCustomObjectService.writeCustomObject(
            variantStatusObjectKey,
            reviewStatusesCustomObject!.container,
            {},
          )
        }
      }),
    )
  }
}
