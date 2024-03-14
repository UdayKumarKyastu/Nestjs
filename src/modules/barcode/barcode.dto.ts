import { IsEAN, IsString } from 'class-validator'

export class BarcodeParams {
  @IsString()
  @IsEAN()
  barcode!: string
}
