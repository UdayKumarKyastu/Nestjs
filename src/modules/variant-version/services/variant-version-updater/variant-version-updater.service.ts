import { Inject, Injectable } from '@nestjs/common'
import { ClientResponse } from '@commercetools/platform-sdk'

import {
  CommercetoolsCustomObjectDao,
  ICanWriteCustomObjects,
} from '../../../commercetools/commercetools-custom-object.dao'
import {
  VariantVersionCustomObject,
  VersionCustomObjectPayload,
} from '../../model/version-custom-object'

export interface ICanUpdateVariantVersion {
  updateVariantVersion(
    versionKey: string,
    data: VersionCustomObjectPayload,
  ): Promise<ClientResponse<VariantVersionCustomObject>>
}

@Injectable()
export class VariantVersionUpdaterService implements ICanUpdateVariantVersion {
  /**
   * A container for custom objects, for variants its this one
   */
  private customObjectContainer = 'productContainer'

  constructor(
    @Inject(CommercetoolsCustomObjectDao)
    private readonly _ctCustomObjectsDao: ICanWriteCustomObjects,
  ) {}

  updateVariantVersion(
    versionKey: string,
    data: VersionCustomObjectPayload,
  ): Promise<ClientResponse<VariantVersionCustomObject>> {
    return this._ctCustomObjectsDao.writeCustomObject(versionKey, this.customObjectContainer, data)
  }
}
