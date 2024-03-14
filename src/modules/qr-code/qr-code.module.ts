import { Module } from '@nestjs/common'

import { QrCodeGeneratorService } from './qr-code-generator.service'

@Module({
  providers: [QrCodeGeneratorService],
  exports: [QrCodeGeneratorService],
})
export class QrCodeModule {}
