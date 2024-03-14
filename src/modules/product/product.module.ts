import { Module } from '@nestjs/common'

import { ConfigurationModule } from '../../configuration/configuration.module'
import { CommerceToolsModule } from '../commercetools/commercetools.module'
import { ContentManagementModule } from '../content-management/content-management.module'
import { CategoriesModule } from '../categories/categories.module'
import { ProductTypeModule } from '../product-type/product-type.module'
import { VariantNutritionModule } from '../variant-nutrition/variant-nutrition.module'
import { AuthModule } from '../auth/auth.module'
import { ProductTaxationModule } from '../product-taxation/product-taxation.module'
import { CtProductModule } from '../ct-product/ct-product.module'
import { VariantHowToDisplayModule } from '../variant-how-to-display/variant-how-to-display.module'
import { LabellingOptionsModule } from '../labelling-options/labelling-options.module'
import { PricingModule } from '../pricing/pricing.module'
import { BarcodeModule } from '../barcode/barcode.module'
import { VariantVersionModule } from '../variant-version/variant-version.module'
import { ReviewStatusModule } from '../product/logic/review-status/review-status.module'
import { VariantReportingModule } from '../variant-reporting/variant-reporting.module'
import { LabellingCardModule } from '../labelling-card/labelling-card.module'

import { ProductMapper } from './logic/product.mapper'
import { ProductService } from './logic/product.service'
import { UpdateVariantMarketingActionsResolver } from './use-cases/update-variant-marketing/update-variant-marketing-actions-resolver'
import { UpdateVariantMarketingService } from './use-cases/update-variant-marketing/update-variant-marketing.service'
import { UpdateVariantReportingService } from './use-cases/update-variant-reporting/update-variant-reporting.service'
import { UpdateProductMarketingService } from './use-cases/update-product-marketing/update-product-marketing.service'
import { ProductMetaDao } from './dao/product-meta.dao'
import { GetProductController } from './use-cases/get-product/get-product.controller'
import { UpdateProductMarketingController } from './use-cases/update-product-marketing/update-product-marketing.controller'
import { UpdateVariantReportingController } from './use-cases/update-variant-reporting/update-variant-reporting.controller'
import { UpdateVariantMarketingController } from './use-cases/update-variant-marketing/update-variant-marketing.controller'
import { UpdateProductSetUpDao } from './use-cases/update-product-set-up/update-product-set-up.dao'
import { UpdateProductSetUpController } from './use-cases/update-product-set-up/update-product-set-up.controller'
import { UpdateProductSetUpService } from './use-cases/update-product-set-up/update-product-set-up.service'
import { UpdateProductCategoryService } from './use-cases/update-product-category/update-product-category.service'
import { UpdateProductCategoryDao } from './use-cases/update-product-category/update-product-category.dao'
import { UpdateProductCategoryController } from './use-cases/update-product-category/update-product-category.controller'
import { UpdateVariantBaristaAttributesService } from './use-cases/update-variant-barista-attributes/update-variant-barista-attributes.service'
import { UpdateVariantBaristaAttributesController } from './use-cases/update-variant-barista-attributes/update-variant-barista-attributes.controller'
import { UpdateVariantBaristaAttributesDao } from './use-cases/update-variant-barista-attributes/update-variant-barista-attributes.dao'
import { DraftChangesCounterService } from './draft-changes-counter.service'
import { UpdateVariantMarketingDao } from './use-cases/update-variant-marketing/update-variant-marketing.dao'
import { UpdateVariantReportingDao } from './use-cases/update-variant-reporting/update-variant-reporting.dao'
import { ProductDraftChangesService } from './logic/product-draft-changes.service'
import { UpdateVariantPricingDao } from './use-cases/update-variant-prices/update-variant-pricing.dao'
import { UpdateVariantPricingService } from './use-cases/update-variant-prices/update-variant-pricing.service'
import { UpdateVariantPricingController } from './use-cases/update-variant-prices/update-variant-prices.controller'
import { UpdateVariantLabellingController } from './use-cases/update-variant-labelling/update-variant-labelling.controller'
import { UpdateVariantLabellingService } from './use-cases/update-variant-labelling/update-variant-labelling.service'
import { UpdateVariantLabellingDao } from './use-cases/update-variant-labelling/update-variant-labelling.dao'
import { ReviewStatusService } from './logic/review-status/review-status.service'
import { UpdateReviewStatusController } from './use-cases/update-review-status/update-review-status.controller'
import { UpdateReviewStatusService } from './use-cases/update-review-status/update-review-status.service'

const DAOs = [
  ProductMetaDao,
  UpdateProductSetUpDao,
  UpdateProductCategoryDao,
  UpdateVariantBaristaAttributesDao,
  UpdateVariantMarketingDao,
  UpdateVariantReportingDao,
  UpdateVariantPricingDao,
  UpdateVariantLabellingDao,
]

@Module({
  imports: [
    VariantReportingModule,
    VariantVersionModule,
    VariantHowToDisplayModule,
    LabellingOptionsModule,
    CtProductModule,
    AuthModule,
    ConfigurationModule,
    CommerceToolsModule,
    ContentManagementModule,
    CategoriesModule,
    ProductTypeModule,
    ProductTaxationModule,
    VariantNutritionModule,
    PricingModule,
    BarcodeModule,
    VariantVersionModule,
    LabellingCardModule,
    ReviewStatusModule,
  ],
  providers: [
    ...DAOs,
    ProductService,
    ProductMapper,
    UpdateVariantMarketingService,
    ProductMapper,
    UpdateVariantMarketingActionsResolver,
    UpdateVariantReportingService,
    UpdateProductMarketingService,
    UpdateProductSetUpService,
    UpdateProductCategoryService,
    UpdateVariantBaristaAttributesService,
    DraftChangesCounterService,
    ProductDraftChangesService,
    UpdateVariantPricingService,
    UpdateVariantLabellingService,
    ReviewStatusService,
    UpdateReviewStatusService,
  ],
  exports: [ProductMapper],
  controllers: [
    GetProductController,
    UpdateProductMarketingController,
    UpdateVariantMarketingController,
    UpdateVariantReportingController,
    UpdateProductSetUpController,
    UpdateProductCategoryController,
    UpdateVariantBaristaAttributesController,
    UpdateVariantPricingController,
    UpdateVariantLabellingController,
    UpdateReviewStatusController,
  ],
})
export class ProductModule {}
