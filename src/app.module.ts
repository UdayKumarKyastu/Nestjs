import { APP_GUARD } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

import { ProductModule } from './modules/product/product.module'
import { ConfigurationModule } from './configuration/configuration.module'
import { VersionModule } from './modules/version/version.module'
import { HealthModule } from './modules/health/health.module'
import { ProductTypeModule } from './modules/product-type/product-type.module'
import { SearchProductsModule } from './modules/search-products/search-products.module'
import { ProductApprovalModule } from './modules/product-approval/product-approval.module'
import { HgTranslationModule } from './modules/hg-translation/hg-translation.module'
import { ProductsBrowseModule } from './modules/products-browse/products-browse.module'
import { StarkisModule } from './modules/starkis/starkis.module'
import { RecipeCalculatorModule } from './modules/recipe-calculator/recipe-calculator.module'
import { PriceImporterModule } from './modules/price-importer/price-importer.module'
import { CustomersModule } from './modules/customers/customers.module'

@Module({
  imports: [
    ConfigurationModule,
    ThrottlerModule.forRoot({ ttl: 60, limit: 100 }),
    VersionModule,
    ProductTypeModule,
    HealthModule,
    ProductModule,
    SearchProductsModule,
    ProductApprovalModule,
    HgTranslationModule,
    ProductsBrowseModule,
    StarkisModule,
    RecipeCalculatorModule,
    PriceImporterModule,
    CustomersModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
