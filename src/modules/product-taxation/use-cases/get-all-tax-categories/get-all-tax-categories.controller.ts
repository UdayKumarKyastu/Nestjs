import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { IsEnum, IsOptional } from 'class-validator'

import { SwaggerApiTag } from '../../../../shared/swagger-api-tag'
import { TaxCategoryDto } from '../../../../shared/dto/tax-category.dto'
import { CountryCode } from '../../../../shared/model/country-code'

import { GetAllTaxCategoriesService } from './get-all-tax-categories.service'

class QueryParams {
  @IsOptional()
  @IsEnum(CountryCode)
  country?: CountryCode
}

@Controller('/v3/product-types/:productType')
export class GetAllTaxCategoriesController {
  constructor(private readonly service: GetAllTaxCategoriesService) {}

  @ApiResponse({
    type: TaxCategoryDto,
    isArray: true,
  })
  @ApiTags(SwaggerApiTag.ProductType)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get('/tax-categories')
  async getAvailableHowToDisplayOptions(
    @Query() queryParams: QueryParams,
  ): Promise<TaxCategoryDto[]> {
    return this.service.getAllTaxCategories(queryParams.country)
  }
}
