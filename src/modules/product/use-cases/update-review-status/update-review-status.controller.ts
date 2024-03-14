import {
  applyDecorators,
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { AuthService } from '../../../../modules/auth/auth.service'
import { SwaggerApiTag } from '../../../../shared/swagger-api-tag'
import { ReviewStatusService } from '../../logic/review-status/review-status.service'
import { Area } from '../../logic/review-status/models/area'

import { UpdateReviewStatusDto } from './update-review-status.dto'
import { UpdateReviewStatusService } from './update-review-status.service'

const ReviewStatusSwagger = applyDecorators(
  ApiTags(SwaggerApiTag.ProductGroup),
  ApiBearerAuth(),
  HttpCode(HttpStatus.NO_CONTENT),
)

@Controller('/v3/products')
export class UpdateReviewStatusController {
  constructor(
    private readonly _reviewStatusService: ReviewStatusService,
    private readonly _updateReviewStatusService: UpdateReviewStatusService,
    private readonly _authService: AuthService,
  ) {}

  @ReviewStatusSwagger
  @Post('/:masterSku/:area/review')
  async updateReviewStatus(
    @Param('masterSku') masterSku: string,
    @Param('area') area: Area,
    @Body() body: UpdateReviewStatusDto,
    @Headers() headers: any,
  ) {
    const authHeader = headers['x-forwarded-authorization'] || headers['authorization'] || ''
    const userPermissions = this._authService.getPermissionsFromJwtToken(
      authHeader.replace('Bearer ', ''),
    )

    this._updateReviewStatusService.validateAreaAndPermissions(area, userPermissions)
    const { fieldName, operationType: action, fieldValue } = body

    const user = await this._authService.getUser(authHeader.replace('Bearer ', ''))

    await this._updateReviewStatusService.updateReviewStatusForProductField({
      masterSku,
      area,
      fieldName,
      action,
      user,
      fieldValue,
    })
  }

  @ReviewStatusSwagger
  @Post('/:masterSku/variants/:variantSku/:area/review')
  async updateVariantReviewStatus(
    @Param('masterSku') masterSku: string,
    @Param('variantSku') variantSku: string,
    @Param('area') area: Area,
    @Body() body: UpdateReviewStatusDto,
    @Headers() headers: any,
  ) {
    const authHeader = headers['x-forwarded-authorization'] || headers['authorization'] || ''
    const userPermissions = this._authService.getPermissionsFromJwtToken(
      authHeader.replace('Bearer ', ''),
    )

    const user = await this._authService.getUser(authHeader.replace('Bearer ', ''))

    this._updateReviewStatusService.validateAreaAndPermissions(area, userPermissions)

    const { fieldName, operationType: action, fieldValue } = body

    await this._updateReviewStatusService.updateReviewStatusForProductField({
      masterSku,
      variantSku,
      area,
      fieldName,
      action,
      fieldValue,
      user,
    })
  }

  @ReviewStatusSwagger
  @Post('/:masterSku/variants/:variantSku/versions/:version/:area/review')
  async updateVersionReviewStatus(
    @Param('masterSku') masterSku: string,
    @Param('area') area: Area,
    @Param('version') version: string,
    @Body() body: UpdateReviewStatusDto,
    @Headers() headers: any,
  ) {
    const authHeader = headers['x-forwarded-authorization'] || headers['authorization'] || ''
    const userPermissions = this._authService.getPermissionsFromJwtToken(
      authHeader.replace('Bearer ', ''),
    )

    this._updateReviewStatusService.validateAreaAndPermissions(area, userPermissions)
    const { fieldName, operationType: action, fieldValue } = body

    const user = await this._authService.getUser(authHeader.replace('Bearer ', ''))

    await this._updateReviewStatusService.updateReviewStatusForProductField({
      masterSku,
      area,
      fieldName,
      fieldValue,
      action,
      version,
      user,
    })
  }
}
