import { Module } from '@nestjs/common'

import { CommerceToolsModule } from '../commercetools/commercetools.module'
import { ContentManagementModule } from '../content-management/content-management.module'
import { ProductTypeModule } from '../product-type/product-type.module'

import { GetProductsPendingApprovalService } from './use-case/get-products-pending-approval/get-products-pending-approval.service'
import { GetProductsPendingApprovalController } from './use-case/get-products-pending-approval/get-products-pending-approval.controller'
import { GetProductsWithStagedChangesService } from './use-case/get-products-pending-approval/get-products-with-staged-changes.service'
import { GetVersionsWithStagedChangesService } from './use-case/get-products-pending-approval/get-versions-with-staged-changes.service'
import { GetNewProductsService } from './use-case/get-new-products/get-new-products.service'
import { GetNewProductsDao } from './use-case/get-new-products/get-new-products.dao'
import { GetNewProductsController } from './use-case/get-new-products/get-new-products.controller'
import { GetLiveSoonProductsService } from './use-case/get-live-soon-products/get-live-soon-products.service'
import { GetLiveSoonProductsDao } from './use-case/get-live-soon-products/get-live-soon-products.dao'
import { GetLiveSoonProductsController } from './use-case/get-live-soon-products/get-live-soon-products.controller'
import { GetDelistSoonProductsController } from './use-case/get-delist-soon-products/get-delist-soon-products.controller'
import { GetDelistSoonProductsService } from './use-case/get-delist-soon-products/get-delist-soon-products.service'
import { GetDelistSoonProductsDao } from './use-case/get-delist-soon-products/get-delist-soon-products.dao'
@Module({
  imports: [CommerceToolsModule, ContentManagementModule, ProductTypeModule],
  providers: [
    GetProductsPendingApprovalService,
    GetProductsWithStagedChangesService,
    GetVersionsWithStagedChangesService,
    GetNewProductsService,
    GetNewProductsDao,
    GetLiveSoonProductsService,
    GetLiveSoonProductsDao,
    GetDelistSoonProductsService,
    GetDelistSoonProductsDao,
  ],
  controllers: [
    GetProductsPendingApprovalController,
    GetNewProductsController,
    GetLiveSoonProductsController,
    GetDelistSoonProductsController,
  ],
})
export class ProductsBrowseModule {}
