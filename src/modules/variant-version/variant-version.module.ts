import { Module } from '@nestjs/common'

import { CommerceToolsModule } from '../commercetools/commercetools.module'
import { CtProductModule } from '../ct-product/ct-product.module'
import { PricingModule } from '../pricing/pricing.module'
import { ContentManagementModule } from '../content-management/content-management.module'
import { AuthModule } from '../auth/auth.module'
import { VariantHowToDisplayModule } from '../variant-how-to-display/variant-how-to-display.module'
import { LabellingOptionsModule } from '../labelling-options/labelling-options.module'
import { LabellingCardModule } from '../labelling-card/labelling-card.module'
import { ReviewStatusModule } from '../../modules/product/logic/review-status/review-status.module'

import { VariantVersionFetcherService } from './services/variant-version-fetcher/variant-version-fetcher.service'
import { GetVariantVersionService } from './use-case/get-variant-version/get-variant-version.service'
import { GetVariantVersionController } from './use-case/get-variant-version/get-variant-version.controller'
import { VariantVersionUpdaterService } from './services/variant-version-updater/variant-version-updater.service'
import { ApproveVersionChangesService } from './use-case/approve-version-changes/approve-version-changes.service'
import { ApproveVersionChangesController } from './use-case/approve-version-changes/approve-version-changes.controller'
import { AllergenDtoCreator } from './services/allergen-dto-creator/allergen-dto-creator'
import { NutritionalsDtoCreator } from './services/nutritionals-dto-creator/nutritionals-dto-creator'
import { RejectVersionChangesController } from './use-case/reject-version-changes/reject-version-changes.controller'
import { RejectVersionChangesService } from './use-case/reject-version-changes/reject-version-changes.service'

@Module({
  imports: [
    CommerceToolsModule,
    CtProductModule,
    PricingModule,
    ContentManagementModule,
    AuthModule,
    VariantHowToDisplayModule,
    LabellingOptionsModule,
    LabellingCardModule,
    ReviewStatusModule,
  ],
  providers: [
    VariantVersionFetcherService,
    GetVariantVersionService,
    VariantVersionUpdaterService,
    ApproveVersionChangesService,
    AllergenDtoCreator,
    NutritionalsDtoCreator,
    RejectVersionChangesService,
  ],
  controllers: [
    GetVariantVersionController,
    ApproveVersionChangesController,
    RejectVersionChangesController,
  ],
  exports: [VariantVersionFetcherService, VariantVersionUpdaterService],
})
export class VariantVersionModule {}
