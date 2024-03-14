import { Controller, Get, Inject, Query } from '@nestjs/common'
import { IsEnum, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiResponse } from '@nestjs/swagger'

import { CountryCode, CountryCodeParser } from '../../../../shared/model/country-code'

import { GetDelistSoonProductsDto } from './dto/get-delist-soon-products.dto'
import {
  GetDelistSoonProductsService,
  ICanGetDelistSoonProducts,
} from './get-delist-soon-products.service'

class QueryParams {
  @IsOptional()
  @IsEnum(CountryCode, { message: `Country must be one of: ${Object.values(CountryCode)}` })
  @Transform(({ value }) => new CountryCodeParser().parse(value))
  country?: CountryCode
}

@Controller('/v1/browse/delist-soon')
export class GetDelistSoonProductsController {
  constructor(@Inject(GetDelistSoonProductsService) private service: ICanGetDelistSoonProducts) {}

  @ApiResponse({ type: GetDelistSoonProductsDto })
  @Get()
  getDelistSoonProducts(@Query() queryParams: QueryParams): Promise<GetDelistSoonProductsDto> {
    return this.service.getDelistSoonProducts(queryParams.country)
  }
}
