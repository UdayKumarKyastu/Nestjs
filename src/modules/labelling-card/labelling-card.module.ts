import { Module } from '@nestjs/common'

import { QrCodeModule } from '../qr-code/qr-code.module'

import { ProductLabellingCardService } from './product-labelling-card.service'

@Module({
  imports: [QrCodeModule],
  providers: [ProductLabellingCardService],
  exports: [ProductLabellingCardService],
})
export class LabellingCardModule {}
