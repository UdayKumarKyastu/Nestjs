import { VariantLiveDates } from '../product/logic/models/variant-live-dates'

import { VariantVersionsPublishStateService } from './services/variant-versions-publish-state/variant-versions-publish-state.service'
import { VariantVersionPublishState } from './model/variant-version-publish-state'

export class VersionEditabilityChecker {
  private publishStateChecker: VariantVersionsPublishStateService
  private stateAllowToEdit = VariantVersionPublishState.Future

  constructor(private variantLiveDates: VariantLiveDates) {
    this.publishStateChecker = new VariantVersionsPublishStateService(
      this.variantLiveDates.from?.toISOString() || null,
    )
  }

  isEditable(versionLiveDates: VariantLiveDates): boolean {
    /**
     * Assume this should never happen, but to be sure handle gracefully and just forbid
     */
    if (!versionLiveDates.from) {
      return false
    }

    const publishState = this.publishStateChecker.getVariantPublishState({
      liveFrom: versionLiveDates.from!.toISOString(),
    })

    return publishState === this.stateAllowToEdit
  }
}
