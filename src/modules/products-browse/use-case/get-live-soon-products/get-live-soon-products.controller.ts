import { Controller, Get, Inject, Query } from '@nestjs/common'
import { IsEnum, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiResponse } from '@nestjs/swagger'

import { CountryCode, CountryCodeParser } from '../../../../shared/model/country-code'

import { GetLiveSoonProductsDto } from './dto/get-live-soon-products.dto'
import {
  GetLiveSoonProductsService,
  ICanGetLiveSoonProducts,
} from './get-live-soon-products.service'

class QueryParams {
  @IsOptional()
  @IsEnum(CountryCode, { message: `Country must be one of: ${Object.values(CountryCode)}` })
  @Transform(({ value }) => new CountryCodeParser().parse(value))
  country?: CountryCode
}

@Controller('/v1/browse/live-soon')
export class GetLiveSoonProductsController {
  constructor(@Inject(GetLiveSoonProductsService) private service: ICanGetLiveSoonProducts) {}

  @ApiResponse({ type: GetLiveSoonProductsDto })
  @Get()
  getLiveSoonProducts(@Query() queryParams: QueryParams): Promise<GetLiveSoonProductsDto> {
    return this.service.getLiveSoonProducts(queryParams.country)
  }
}
