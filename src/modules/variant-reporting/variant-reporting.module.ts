import { Module } from '@nestjs/common'

import { ProductTypeModule } from '../product-type/product-type.module'

import { GetAvailableReportingOptionsController } from './use-cases/get-available-reporting-options/get-available-reporting-options.controller'
import { ReportingOptionsResolverService } from './reporting-options-resolver.service'

@Module({
  imports: [ProductTypeModule],
  controllers: [GetAvailableReportingOptionsController],
  providers: [ReportingOptionsResolverService],
  exports: [ReportingOptionsResolverService],
})
export class VariantReportingModule {}
