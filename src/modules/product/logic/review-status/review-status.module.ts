import { Module } from '@nestjs/common'

import { CommerceToolsModule } from '../../../commercetools/commercetools.module'
import { ConfigurationModule } from '../../../../configuration/configuration.module'
import { CtProductModule } from '../../../ct-product/ct-product.module'
import { ProductService } from '../../../product/logic/product.service'
import { ReviewStatusService } from '../../../product/logic/review-status/review-status.service'
import { ProductDraftChangesService } from '../../../product/logic/product-draft-changes.service'
import { ProductMapper } from '../../../product/logic/product.mapper'
import { DraftChangesCounterService } from '../../../product/draft-changes-counter.service'
import { CategoryNestedListBuilderService } from '../../../categories/category-nested-list-builder.service'
import { TaxCategoriesService } from '../../../product-taxation/tax-categories.service'
import { CategoriesService } from '../../../categories/categories.service'
import { ProductTaxationDao } from '../../../product-taxation/product-taxation.dao.service'
import { CategoriesDao } from '../../../categories/categories.dao'
import { CategoriesMapper } from '../../../categories/categories-mapper'
import { ProductLabellingCardService } from '../../../labelling-card/product-labelling-card.service'
import { CtProductDao } from '../../../ct-product/ct-product.dao'
import { PricingService } from '../../../pricing/pricing.service'
import { PricingModule } from '../../../pricing/pricing.module'
import { ProductImageService } from '../../../content-management/services/product-image.service'
import { QrCodeGeneratorService } from '../../../qr-code/qr-code-generator.service'
import { VariantVersionFetcherService } from '../../../variant-version/services/variant-version-fetcher/variant-version-fetcher.service'
import { contentfulClientConnectionProvider } from '../../../content-management/contentful/contentful-client-connection.provider'

@Module({
  imports: [ConfigurationModule, CommerceToolsModule, CtProductModule, PricingModule],
  providers: [
    ReviewStatusService,
    ProductService,
    ProductService,
    ProductDraftChangesService,
    ProductMapper,
    DraftChangesCounterService,
    CategoryNestedListBuilderService,
    TaxCategoriesService,
    CategoriesService,
    ProductTaxationDao,
    CategoriesDao,
    CategoriesMapper,
    ProductLabellingCardService,
    CtProductDao,
    PricingService,
    ProductImageService,
    QrCodeGeneratorService,
    VariantVersionFetcherService,
    contentfulClientConnectionProvider,
  ],
  controllers: [],
  exports: [ReviewStatusService],
})
export class ReviewStatusModule {}
