import { Controller, Get, Inject, Query } from '@nestjs/common'
import { IsEnum, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiResponse } from '@nestjs/swagger'

import { CountryCode, CountryCodeParser } from '../../../../shared/model/country-code'

import { GetProductsPendingApprovalDto } from './dto/get-products-pending-approval.dto'
import {
  GetProductsPendingApprovalService,
  ICanGetPendingApprovalProducts,
} from './get-products-pending-approval.service'

class QueryParams {
  @IsOptional()
  @IsEnum(CountryCode, { message: `Country must be one of: ${Object.values(CountryCode)}` })
  @Transform(({ value }) => new CountryCodeParser().parse(value))
  country?: CountryCode
}

@Controller('/v1/browse/pending')
export class GetProductsPendingApprovalController {
  constructor(
    @Inject(GetProductsPendingApprovalService) private service: ICanGetPendingApprovalProducts,
  ) {}

  @ApiResponse({ type: GetProductsPendingApprovalDto })
  @Get()
  getProductsPendingApproval(
    @Query() queryParams: QueryParams,
  ): Promise<GetProductsPendingApprovalDto> {
    return this.service.getProductsPendingApproval({
      country: queryParams.country,
    })
  }
}
