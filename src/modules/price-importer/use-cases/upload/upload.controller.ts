import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import FormData from 'form-data'

import { AuthPermission } from '../../../auth/auth-permission'
import { RequirePermissions } from '../../../auth/has-permission.guard'
import { PriceImporterService } from '../../price-importer.service'

@Controller('/v1/price-importer')
export class UploadController {
  constructor(private readonly _priceImporterService: PriceImporterService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('import'))
  @RequirePermissions(AuthPermission.MANAGE_PRICING_IMPORTS)
  async asyncUploadPriceImportCSV(@UploadedFile() file: any): Promise<any> {
    const formData = new FormData()

    formData.append(file.fieldname, file.buffer.toString('binary'), {
      filename: file.originalname,
      contentType: file.mimetype,
    })

    return this._priceImporterService.upload(formData)
  }
}
