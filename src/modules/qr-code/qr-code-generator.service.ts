import { Injectable } from '@nestjs/common'
import QRCode from 'qrcode'

export interface QrCodeGenerator {
  generateAsBase64png(content: string): Promise<string>
  generateAsSvgCode(content: string): Promise<string>
}

@Injectable()
export class QrCodeGeneratorService implements QrCodeGenerator {
  private size = 200

  async generateAsBase64png(content: string): Promise<string> {
    return QRCode.toDataURL(content || 'no-hg-code', {
      type: 'image/png',
      width: this.size,
      margin: 0,
    })
  }

  generateAsSvgCode(content: string): Promise<string> {
    return QRCode.toString(content || 'no-hg-code', {
      type: 'svg',
      width: this.size,
      margin: 0,
    })
  }
}
