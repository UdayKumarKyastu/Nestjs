import { ForbiddenException, Injectable } from '@nestjs/common'

import { AuthPermission } from '../../../auth/auth-permission'
import {
  ReviewStatusService,
  UpdateReviewStatusParams,
} from '../../logic/review-status/review-status.service'
import { Area } from '../../logic/review-status/models/area'

@Injectable()
export class UpdateReviewStatusService {
  private allowedTabsWithPermissions: { [key: string]: string } = {
    [Area.MARKETING]: AuthPermission.REVIEW_MARKETING_CHANGES,
    [Area.LABELLING]: AuthPermission.REVIEW_LABELLING_CHANGES,
    [Area.PRICING]: AuthPermission.REVIEW_PRICING_CHANGES,
    [Area.REPORTING]: AuthPermission.REVIEW_REPORTING_CHANGES,
    [Area.CATEGORIES]: AuthPermission.REVIEW_MENU_CATEGORISATION_CHANGES,
    [Area.ATTRIBUTES]: AuthPermission.REVIEW_BARISTA_ATTRIBUTE_CHANGES,
    [Area.SETUP]: AuthPermission.REVIEW_BARISTA_ATTRIBUTE_CHANGES,
  }

  constructor(private readonly _reviewStatusService: ReviewStatusService) {}

  validateAreaAndPermissions(area: string, userPermissions: string[]) {
    const requiredPermission = this.allowedTabsWithPermissions[area]

    if (!requiredPermission) {
      throw new ForbiddenException(
        'Area does not match allowed areas in review status configuration',
      )
    }

    const userHasRequiredPermission = userPermissions.includes(requiredPermission)

    if (!userHasRequiredPermission) {
      throw new ForbiddenException(
        `User does not have permission to review changes to ${area} tabs`,
      )
    }

    return true
  }

  updateReviewStatusForProductField(params: UpdateReviewStatusParams) {
    return this._reviewStatusService.updateReviewStatus(params)
  }
}
