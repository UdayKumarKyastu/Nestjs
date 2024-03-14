import { Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'

import { RequirePermissions } from '../../../auth/has-permission.guard'
import { AuthPermission } from '../../../auth/auth-permission'
import {
  VariantVersionControllerParams,
  VariantVersionControllerParamsSwagger,
} from '../../variant-version-controller-params'

import { ApproveVersionChangesService } from './approve-version-changes.service'

@Controller('/v3/products/:masterSku/variants/:variantSku/versions/:versionKey')
export class ApproveVersionChangesController {
  constructor(private readonly _approveVersionChangesService: ApproveVersionChangesService) {}

  @ApiBearerAuth()
  @VariantVersionControllerParamsSwagger
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(AuthPermission.APPROVE_PRODUCT_CHANGES)
  @Post('/publish')
  async approve(@Param() params: VariantVersionControllerParams): Promise<void> {
    await this._approveVersionChangesService.approveDraftChanges(
      params.masterSku,
      params.versionKey,
    )
  }
}
