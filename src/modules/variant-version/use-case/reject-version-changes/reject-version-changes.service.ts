import { Inject, Injectable, ForbiddenException } from '@nestjs/common'

import {
  ICanFetchVariantVersions,
  VariantVersionFetcherService,
} from '../../services/variant-version-fetcher/variant-version-fetcher.service'
import {
  ICanUpdateVariantVersion,
  VariantVersionUpdaterService,
} from '../../services/variant-version-updater/variant-version-updater.service'
import { CommercetoolsCustomObjectDao } from '../../../commercetools/commercetools-custom-object.dao'
import { VersionCustomObjectPayload } from '../../model/version-custom-object'
import { ReviewStatusCounter } from '../../../product/logic/review-status/review-status-counter/review-status-counter'

type CanFetchVariantVersionByKeyOrThrow = Pick<
  ICanFetchVariantVersions,
  'fetchVariantVersionByKeyOrThrow'
>

@Injectable()
export class RejectVersionChangesService {
  constructor(
    @Inject(VariantVersionFetcherService)
    private readonly _variantVersionService: CanFetchVariantVersionByKeyOrThrow,
    @Inject(VariantVersionUpdaterService)
    private _variantVersionUpdaterService: ICanUpdateVariantVersion,
    @Inject(CommercetoolsCustomObjectDao)
    private readonly _commerceToolsCustomObjectService: CommercetoolsCustomObjectDao,
  ) {}

  async rejectDraftChanges(masterSku: string, versionKey: string) {
    const version = await this._variantVersionService.fetchVariantVersionByKeyOrThrow(versionKey)

    const reviewStatusCustomObject =
      await this._commerceToolsCustomObjectService.getCustomObjectByKey(
        `${masterSku}-${versionKey}-version-reviewStatus`,
      )

    const reviewStatusCount = ReviewStatusCounter.countVariantStatuses(
      reviewStatusCustomObject?.value,
    )

    if (reviewStatusCount.pending + reviewStatusCount.accepted > 0) {
      throw new ForbiddenException('All version changes have to be rejected')
    }

    const versionToSave: VersionCustomObjectPayload = {
      ...version.data,
      draft: version.data.approved,
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
