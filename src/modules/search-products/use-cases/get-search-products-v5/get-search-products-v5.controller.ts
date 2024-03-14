import { Controller, Get, Inject, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'

import { SwaggerApiTag } from '../../../../shared/swagger-api-tag'
import { SearchProperty } from '../../search-property'

import { SearchProductsListDto } from './search-list-product.dto'
import {
  GetSearchProductV5Service,
  IGetSearchProductV4Service,
} from './get-search-product-v5.service'

@Controller('/v5/products')
export class GetSearchProductsV5Controller {
  constructor(
    @Inject(GetSearchProductV5Service)
    private readonly _searchProductV4Service: IGetSearchProductV4Service,
  ) {}

  @ApiTags(SwaggerApiTag.ProductGroup, SwaggerApiTag.Search)
  @ApiQuery({
    name: 'query',
    description: 'Search product name, Product SKU or Hamilton Grant ID',
    required: true,
    type: 'string',
    example: 'UK000001',
  })
  @ApiQuery({
    name: 'propertyName',
    description: 'Name of property we are searching by',
    required: true,
    type: 'name | hgCode | sku',
    example: 'sku',
  })
  @ApiQuery({
    name: 'country',
    description: 'Country code we are searching by',
    required: false,
    type: 'UK | FR | US | HK',
    example: 'uk',
  })
  @ApiBearerAuth()
  @ApiResponse({
    type: SearchProductsListDto,
  })
  @Get()
  async search(
    @Query('query') query = '',
    @Query('propertyName') propertyName: SearchProperty = SearchProperty.Name,
    @Query('limit') limit = 10,
    @Query('page') page = 1,
    @Query('country') country = '',
  ): Promise<SearchProductsListDto> {
    return this._searchProductV4Service.searchProducts(query, propertyName, limit, page, country)
  }
}
