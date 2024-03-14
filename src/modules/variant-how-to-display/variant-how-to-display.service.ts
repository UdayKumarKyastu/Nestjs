import { Injectable } from '@nestjs/common'

import { ProductTypeKey } from '../product-type/product-type-key'
import { EnumOption } from '../product/logic/models/enum-option'

import { VariantHowToDisplayDao } from './variant-how-to-display.dao'

export interface ICanFindHTDOptions {
  findAll(productType: ProductTypeKey): Promise<EnumOption[]>
}

@Injectable()
export class VariantHowToDisplayService implements ICanFindHTDOptions {
  constructor(private readonly _howToDisplayDao: VariantHowToDisplayDao) {}

  async findAll(productType: ProductTypeKey) {
    return this._howToDisplayDao.findAll(productType)
  }
}
