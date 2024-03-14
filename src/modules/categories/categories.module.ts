import { Module } from '@nestjs/common'

import { CommerceToolsModule } from '../commercetools/commercetools.module'
import { ConfigurationModule } from '../../configuration/configuration.module'
import { CtProductModule } from '../ct-product/ct-product.module'

import { CategoriesMapper } from './categories-mapper'
import { CategoriesDao } from './categories.dao'
import { CategoriesService } from './categories.service'
import { CategoryNestedListBuilderService } from './category-nested-list-builder.service'
import { GetProductCategoriesController } from './use-cases/get-product-categories/get-product-categories.controller'
import { GetProductCategoriesService } from './use-cases/get-product-categories/get-product-categories.service'

@Module({
  imports: [ConfigurationModule, CommerceToolsModule, CtProductModule],
  providers: [
    CategoriesMapper,
    CategoriesDao,
    CategoriesService,
    CategoryNestedListBuilderService,
    GetProductCategoriesService,
  ],
  exports: [
    CategoriesMapper,
    CategoriesDao,
    CategoriesService,
    CategoryNestedListBuilderService,
    GetProductCategoriesService,
  ],
  controllers: [GetProductCategoriesController],
})
export class CategoriesModule {}
