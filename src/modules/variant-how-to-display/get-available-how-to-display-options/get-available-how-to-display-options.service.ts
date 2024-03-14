import { Injectable } from '@nestjs/common'

import { VariantHowToDisplayService } from '../variant-how-to-display.service'
import { ProductTypeKey } from '../../product-type/product-type-key'

import { GetAvailableHowToDisplayOptionsDto } from './get-available-how-to-display-options.dto'

@Injectable()
export class GetAvailableHowToDisplayOptionsService {
  constructor(private readonly _howToDisplayService: VariantHowToDisplayService) {}

  async getAvailableOptionsDto(
    productType: ProductTypeKey,
  ): Promise<GetAvailableHowToDisplayOptionsDto> {
    return {
      options: await this._howToDisplayService.findAll(productType),
    }
  }
}
