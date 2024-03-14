import { Inject, Injectable } from '@nestjs/common'

import { QrCodeGenerator, QrCodeGeneratorService } from '../qr-code/qr-code-generator.service'
import { HowToCardData } from '../../shared/model/variant-labelling'
import { HgCodeAttribute } from '../product-attributes/common-variant-attributes/hg-code-attribute'

export interface CanGenerateHowToCard {
  getProductVariantHowToCardForHgID(hgID: HgCodeAttribute | string[] | null): Promise<HowToCardData>
}

@Injectable()
export class ProductLabellingCardService implements CanGenerateHowToCard {
  constructor(@Inject(QrCodeGeneratorService) private readonly _qrCodeGenerator: QrCodeGenerator) {}

  async getProductVariantHowToCardForHgID(
    value: HgCodeAttribute | string[] | null,
  ): Promise<HowToCardData> {
    const fileName = Array.isArray(value) ? value.join('_') : value
    const codeValue = Array.isArray(value) ? value.join(',') : value?.value

    return {
      fileName: `${fileName}_QRcode`,
      qrPng: await this._qrCodeGenerator.generateAsBase64png(codeValue ?? 'no-hg-code'),
      qrSvg: await this._qrCodeGenerator.generateAsSvgCode(codeValue ?? 'no-hg-code'),
    }
  }
}
