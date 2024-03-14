import { Logger } from '@nestjs/common'
import { isAfter, isSameDay } from 'date-fns'
import validator from 'validator'

import { VariantVersion } from '../../model/variant-version'
import { VariantVersionPublishState } from '../../model/variant-version-publish-state'

export interface ICanDetectVariantVersionPublishedState {
  getVariantPublishState(variant: VariantVersion): VariantVersionPublishState
}

export class VariantVersionsPublishStateService implements ICanDetectVariantVersionPublishedState {
  private logger = new Logger(VariantVersionsPublishStateService.name)

  constructor(private liveVariantLiveFromDateString: string | null) {
    if (!liveVariantLiveFromDateString) {
      this.logger.warn(
        `Expected live variant "liveFrom" date to be always defined. Received: ${liveVariantLiveFromDateString}`,
      )

      return
    }

    if (!validator.isISO8601(liveVariantLiveFromDateString)) {
      throw new Error(
        `LiveTo param must be parsable date. Received ${liveVariantLiveFromDateString}`,
      )
    }
  }

  getVariantPublishState(variant: Pick<VariantVersion, 'liveFrom'>): VariantVersionPublishState {
    if (!validator.isISO8601(variant.liveFrom)) {
      throw new Error(`Variant live date param must be parsable date. Received ${variant.liveFrom}`)
    }

    /**
     * If product has NO live from, it means it was never set with any version - so all versions are future
     */
    if (!this.liveVariantLiveFromDateString) {
      return VariantVersionPublishState.Future
    }

    const liveVariantLiveFromDate = new Date(this.liveVariantLiveFromDateString)
    const versionLiveFromDate = new Date(variant.liveFrom)

    /**
     * Using year-month-day precision (ignore time),
     * detect if version might be the current one
     */
    if (isSameDay(liveVariantLiveFromDate, versionLiveFromDate)) {
      /**
       * Even if live and version dates are the same, they might be in the future
       * This is scenario for new created product. So they are FUTURE
       */
      if (isAfter(liveVariantLiveFromDate, new Date())) {
        return VariantVersionPublishState.Future
      }

      return VariantVersionPublishState.Current
    }

    /**
     * If version live date is past live, its future, otherwise past.
     * Case of same day is handled in previous if
     */
    if (isAfter(versionLiveFromDate, liveVariantLiveFromDate)) {
      return VariantVersionPublishState.Future
    } else {
      return VariantVersionPublishState.Previous
    }
  }
}
