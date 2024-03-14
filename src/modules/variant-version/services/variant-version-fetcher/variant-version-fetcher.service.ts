import { Inject, Injectable } from '@nestjs/common'
import { ProductVariant } from '@commercetools/platform-sdk'
import { HttpException } from '@nestjs/common/exceptions/http.exception'

import {
  CommercetoolsCustomObjectDao,
  ICanFetchCustomObjects,
} from '../../../commercetools/commercetools-custom-object.dao'
import { VariantVersionsReferenceExtractor } from '../../util/variant-versions-reference-extractor/variant-versions-reference-extractor'
import { VersionCustomObjectPayload } from '../../model/version-custom-object'
import { VariantVersion } from '../../model/variant-version'

export type VariantVersionWithId = {
  data: VersionCustomObjectPayload
  id: string
}

export type VariantVersionWithIdAndModel = VariantVersionWithId & {
  model: VariantVersion
}

export interface ICanFetchVariantVersions {
  fetchVariantVersionsForIDs(variantsIDs: string[]): Promise<VariantVersionWithId[]>
  fetchVariantVersionsForVariant(
    sku: string,
    hasAttributes: Pick<ProductVariant, 'attributes'>,
  ): Promise<VariantVersionWithIdAndModel[]>
  fetchVariantVersionByKeyOrThrow(
    versionKey: string,
    error?: HttpException,
  ): Promise<VariantVersionWithId>
}

@Injectable()
export class VariantVersionFetcherService implements ICanFetchVariantVersions {
  private versionIdExtractor = new VariantVersionsReferenceExtractor()

  constructor(
    @Inject(CommercetoolsCustomObjectDao) private ctCustomObjectsDao: ICanFetchCustomObjects,
  ) {}

  async fetchVariantVersionsForIDs(variantsIDs: string[]): Promise<Array<VariantVersionWithId>> {
    if (variantsIDs.length === 0) {
      return []
    }

    const customObjectsWithVersions = await this.ctCustomObjectsDao.getCustomObjectsByIds(
      variantsIDs,
    )

    /**
     * TODO: Validate response schema
     */
    return customObjectsWithVersions.body.results.map((res) => {
      return {
        id: res.id,
        data: {
          ...res.value,
          key: res.key,
        } as VersionCustomObjectPayload,
      }
    })
  }

  async fetchVariantVersionsForVariant(
    sku: string,
    hasAttributes: Pick<ProductVariant, 'attributes'>,
  ) {
    const ids = this.versionIdExtractor.extractVersionsReferencesFromVariant(hasAttributes)
    const response = await this.fetchVariantVersionsForIDs(ids)

    return response.map(
      (r): VariantVersionWithIdAndModel => ({
        ...r,
        model: VariantVersion.fromRawCtObject(r.id, sku, r.data),
      }),
    )
  }

  async fetchVariantVersionByKeyOrThrow(
    versionKey: string,
    error?: HttpException,
  ): Promise<VariantVersionWithId> {
    const response = await this.ctCustomObjectsDao
      .getCustomObjectByKeyOrThrow(versionKey, error)
      .then(
        (resp): VariantVersionWithId => ({
          id: resp.id,
          data: resp.value as VersionCustomObjectPayload,
        }),
      )

    return response
  }
}
