import { Module } from '@nestjs/common'

import { CommerceToolsModule } from '../commercetools/commercetools.module'
import { CtProductModule } from '../ct-product/ct-product.module'
import { AuthModule } from '../auth/auth.module'

import { ProductTaxationDao } from './product-taxation.dao.service'
import { UpdateProductTaxationController } from './use-cases/update-product-taxation/update-product-taxation.controller'
import { TaxCategoriesService } from './tax-categories.service'
import { UpdateProductTaxationService } from './use-cases/update-product-taxation/update-product-taxation.service'
import { GetAllTaxCategoriesController } from './use-cases/get-all-tax-categories/get-all-tax-categories.controller'
import { GetAllTaxCategoriesService } from './use-cases/get-all-tax-categories/get-all-tax-categories.service'

@Module({
  imports: [AuthModule, CommerceToolsModule, CtProductModule],
  providers: [
    ProductTaxationDao,
    TaxCategoriesService,
    UpdateProductTaxationService,
    GetAllTaxCategoriesService,
  ],
  exports: [ProductTaxationDao, UpdateProductTaxationService, TaxCategoriesService],
  controllers: [UpdateProductTaxationController, GetAllTaxCategoriesController],
})
export class ProductTaxationModule {}
