import { Controller, Get, Inject, Query } from '@nestjs/common'
import { IsEnum, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiResponse } from '@nestjs/swagger'

import { CountryCode, CountryCodeParser } from '../../../../shared/model/country-code'

import { GetNewProductsDto } from './dto/get-new-products.dto'
import { GetNewProductsService, ICanGetNewProducts } from './get-new-products.service'

class QueryParams {
  @IsOptional()
  @IsEnum(CountryCode, { message: `Country must be one of: ${Object.values(CountryCode)}` })
  @Transform(({ value }) => new CountryCodeParser().parse(value))
  country?: CountryCode
}

@Controller('/v1/browse/new')
export class GetNewProductsController {
  constructor(@Inject(GetNewProductsService) private service: ICanGetNewProducts) {}

  @ApiResponse({ type: GetNewProductsDto })
  @Get()
  getNewProducts(@Query() queryParams: QueryParams): Promise<GetNewProductsDto> {
    return this.service.getNewProducts(queryParams.country)
  }
}
