import { Module } from '@nestjs/common'

import { CommerceToolsModule } from '../commercetools/commercetools.module'

import { BarcodeService } from './barcode.service'
import { BarcodeController } from './barcode.controller'

@Module({
  imports: [CommerceToolsModule],
  providers: [BarcodeService],
  exports: [BarcodeService],
  controllers: [BarcodeController],
})
export class BarcodeModule {}
