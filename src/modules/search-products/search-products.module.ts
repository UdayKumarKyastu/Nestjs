import { Module } from '@nestjs/common'

import { ProductModule } from '../product/product.module'
import { CommerceToolsModule } from '../commercetools/commercetools.module'
import { ContentManagementModule } from '../content-management/content-management.module'
import { ProductTypeModule } from '../product-type/product-type.module'

import { SearchProductsDao } from './search-products.dao'
import { GetSearchProductsV5Controller } from './use-cases/get-search-products-v5/get-search-products-v5.controller'
import { SearchProductMapperV5Service } from './use-cases/get-search-products-v5/search-product-mapper-v5.service'
import { GetSearchProductV5Service } from './use-cases/get-search-products-v5/get-search-product-v5.service'

@Module({
  imports: [CommerceToolsModule, ProductModule, ContentManagementModule, ProductTypeModule],
  providers: [SearchProductsDao, SearchProductMapperV5Service, GetSearchProductV5Service],
  exports: [SearchProductsDao, GetSearchProductV5Service],
  controllers: [GetSearchProductsV5Controller],
})
export class SearchProductsModule {}
