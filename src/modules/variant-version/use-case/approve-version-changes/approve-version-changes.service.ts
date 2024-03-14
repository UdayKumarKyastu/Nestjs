import { ForbiddenException, Inject, Injectable } from '@nestjs/common'

import {
  ICanFetchVariantVersions,
  VariantVersionFetcherService,
} from '../../services/variant-version-fetcher/variant-version-fetcher.service'
import {
  ICanUpdateVariantVersion,
  VariantVersionUpdaterService,
} from '../../services/variant-version-updater/variant-version-updater.service'
import { VersionCustomObjectPayload } from '../../model/version-custom-object'
import { CtProductDao, ICanGetCtProduct } from '../../../ct-product/ct-product.dao'
import { CommercetoolsCustomObjectDao } from '../../../commercetools/commercetools-custom-object.dao'
import { ReviewStatusCounter } from '../../../product/logic/review-status/review-status-counter/review-status-counter'
import { VersionChangesReverter } from '../version-changes-reverter/version-changes-reverter'

@Injectable()
export class ApproveVersionChangesService {
  constructor(
    @Inject(VariantVersionFetcherService)
    private readonly _variantVersionService: Pick<
      ICanFetchVariantVersions,
      'fetchVariantVersionByKeyOrThrow'
    >,
    @Inject(VariantVersionUpdaterService)
    private _variantVersionUpdaterService: ICanUpdateVariantVersion,

    @Inject(CtProductDao)
    private readonly _productDao: Pick<ICanGetCtProduct, 'getOneProductBySkuOrThrow'>,

    @Inject(CommercetoolsCustomObjectDao)
    private readonly _commerceToolsCustomObjectService: CommercetoolsCustomObjectDao,
  ) {}

  async approveDraftChanges(masterSku: string, versionKey: string) {
    const version = await this._variantVersionService.fetchVariantVersionByKeyOrThrow(versionKey)

    const reviewStatusObjectKey = `${masterSku}-${versionKey}-version-reviewStatus`

    const reviewStatusCustomObject =
      await this._commerceToolsCustomObjectService.getCustomObjectByKey(reviewStatusObjectKey)

    const reviewStatusCount = ReviewStatusCounter.countVariantStatuses(
      reviewStatusCustomObject?.value || {},
    )

    // if (reviewStatusCount.pending > 0) {
    //   throw new ForbiddenException('All version changes have to be reviewed')
    // }

    const versionWithRevertedChanges = new VersionChangesReverter(
      reviewStatusCustomObject?.value,
      version.data,
    ).revertRejectedChanges()

    const versionToSave: VersionCustomObjectPayload = {
      ...version.data,
      approved: {
        ...versionWithRevertedChanges,
      },
      draft: {
        ...versionWithRevertedChanges,
      },
      hasDraftChanges: false,
    }

    await this._variantVersionUpdaterService.updateVariantVersion(versionKey, versionToSave)

    if (reviewStatusCustomObject) {
      await this._commerceToolsCustomObjectService.writeCustomObject(
        reviewStatusCustomObject.key,
        reviewStatusCustomObject.container,
        {},
      )
    }
  }
}
