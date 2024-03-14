import { Module } from '@nestjs/common'

import { CommerceToolsModule } from '../commercetools/commercetools.module'
import { AuthModule } from '../auth/auth.module'
import { CtProductModule } from '../ct-product/ct-product.module'

import { UpdateVariantMarketingService } from '../product/use-cases/update-variant-marketing/update-variant-marketing.service'
import { UpdateVariantMarketingDao } from '../product/use-cases/update-variant-marketing/update-variant-marketing.dao'
import { VariantHowToDisplayDao } from '../variant-how-to-display/variant-how-to-display.dao'
import { UpdateVariantMarketingActionsResolver } from '../product/use-cases/update-variant-marketing/update-variant-marketing-actions-resolver'
import { VariantVersionUpdaterService } from '../variant-version/services/variant-version-updater/variant-version-updater.service'
import { VariantVersionFetcherService } from '../variant-version/services/variant-version-fetcher/variant-version-fetcher.service'
import { ReviewStatusService } from '../product/logic/review-status/review-status.service'
import { ProductTypeModule } from '../product-type/product-type.module'
import { ProductMapper } from '../product/logic/product.mapper'
import { ContentManagementModule } from '../content-management/content-management.module'
import { TaxCategoriesService } from '../product-taxation/tax-categories.service'
import { CategoryNestedListBuilderService } from '../categories/category-nested-list-builder.service'
import { PricingModule } from '../pricing/pricing.module'
import { LabellingCardModule } from '../labelling-card/labelling-card.module'
import { ProductTaxationModule } from '../product-taxation/product-taxation.module'
import { CategoriesModule } from '../categories/categories.module'
import { ProductGroup } from '../../shared/model/product-group'
import { VariantReportingModule } from '../variant-reporting/variant-reporting.module'
import { LabellingOptionsModule } from '../labelling-options/labelling-options.module'
import { BarcodeModule } from '../barcode/barcode.module'

import { RevertRejectedChangesService } from './revert-rejected-changes.service'
import { ProductApprovalService } from './product-approval.service'
import { ProductApprovalController } from './product-approval.controller'
@Module({
  imports: [
    CommerceToolsModule,
    CtProductModule,
    AuthModule,
    ProductTypeModule,
    ContentManagementModule,
    PricingModule,
    LabellingCardModule,
    ProductTaxationModule,
    CategoriesModule,
    VariantReportingModule,
    LabellingOptionsModule,
    BarcodeModule,
  ],
  providers: [
    ProductApprovalService,
    UpdateVariantMarketingService,
    UpdateVariantMarketingDao,
    VariantHowToDisplayDao,
    UpdateVariantMarketingActionsResolver,
    VariantVersionUpdaterService,
    VariantVersionFetcherService,
    ReviewStatusService,
    ProductMapper,
    TaxCategoriesService,
    CategoryNestedListBuilderService,
    RevertRejectedChangesService,
    ProductGroup,
  ],
  exports: [ProductApprovalService],
  controllers: [ProductApprovalController],
})
export class ProductApprovalModule {}
