import { Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'

import { RequirePermissions } from '../../../auth/has-permission.guard'
import { AuthPermission } from '../../../auth/auth-permission'
import {
  VariantVersionControllerParams,
  VariantVersionControllerParamsSwagger,
} from '../../variant-version-controller-params'

import { RejectVersionChangesService } from './reject-version-changes.service'

@Controller('/v3/products/:masterSku/variants/:variantSku/versions/:versionKey')
export class RejectVersionChangesController {
  constructor(private readonly _rejectVersionChangesService: RejectVersionChangesService) {}

  @ApiBearerAuth()
  @VariantVersionControllerParamsSwagger
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(AuthPermission.APPROVE_PRODUCT_CHANGES)
  @Post('/rejection')
  async approve(@Param() params: VariantVersionControllerParams): Promise<void> {
    await this._rejectVersionChangesService.rejectDraftChanges(params.masterSku, params.versionKey)
  }
}
