import { Injectable } from '@nestjs/common'
import { CustomObject } from '@commercetools/platform-sdk'

import { CommercetoolsContext } from '../commercetools/commercetools-context'
import { CtProductDao } from '../ct-product/ct-product.dao'
import { CommercetoolsCustomObjectDao } from '../commercetools/commercetools-custom-object.dao'

import { RevertRejectedChangesService } from './revert-rejected-changes.service'

export interface IProductApprovalService {
  approveDraftChanges(masterSku: string): Promise<void>
  rejectDraftChanges(masterSku: string): Promise<void>
}

@Injectable()
export class ProductApprovalService implements IProductApprovalService {
  constructor(
    private readonly _ctContext: CommercetoolsContext,
    private readonly _productDao: CtProductDao,
    private readonly _commerceToolsCustomObjectService: CommercetoolsCustomObjectDao,
    private readonly _revertRejectedChangesService: RevertRejectedChangesService,
  ) {}

  async resetReviewStatusesObjects(reviewStatuses: CustomObject[]) {
    await Promise.all(
      reviewStatuses.map(
        async ({ key, container }) =>
          await this._commerceToolsCustomObjectService.writeCustomObject(key, container, {}),
      ),
    )
  }

  async approveDraftChanges(masterSku: string): Promise<void> {
    await this._revertRejectedChangesService.revertRejectedChanges(masterSku)

    const product = await this._productDao.getOneProductBySkuOrThrow(masterSku)

    await this._ctContext.products
      .withKey({
        key: masterSku,
      })
      .post({
        body: {
          version: product.version,
          actions: [
            {
              action: 'publish',
              scope: 'All',
            },
          ],
        },
      })
      .execute()
  }

  async rejectDraftChanges(masterSku: string): Promise<void> {
    const product = await this._productDao.getOneProductBySkuOrThrow(masterSku)

    await this._ctContext.products
      .withKey({
        key: masterSku,
      })
      .post({
        body: {
          version: product.version,
          actions: [
            {
              action: 'revertStagedChanges',
            },
          ],
        },
      })
      .execute()
  }
}
