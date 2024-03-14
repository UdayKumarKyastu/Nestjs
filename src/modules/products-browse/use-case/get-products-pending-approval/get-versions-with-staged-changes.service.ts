import { Injectable } from '@nestjs/common'

import { CommercetoolsContext } from '../../../commercetools/commercetools-context'
import { CountryCode } from '../../../../shared/model/country-code'
import { VariantVersionCustomObject } from '../../../variant-version/model/version-custom-object'

export interface ICanGetVersionsWithStagedChanges {
  getVersions(
    limit: number,
    offset: number,
    country?: CountryCode,
  ): Promise<readonly [versions: VariantVersionCustomObject[], total: number]>

  getVersionsWithDraftChanges(): Promise<VariantVersionCustomObject[]>
}

@Injectable()
export class GetVersionsWithStagedChangesService implements ICanGetVersionsWithStagedChanges {
  constructor(private ct: CommercetoolsContext) {}

  private attachCountryCondition(originalCondition: string, country: CountryCode) {
    return `${originalCondition} AND value(hg(country = "${country}"))`
  }

  getVersions(limit: number, offset: number, country?: CountryCode) {
    let whereCondition = `value(hasDraftChanges = true)`

    if (country) {
      whereCondition = this.attachCountryCondition(whereCondition, country)
    }

    return this.ct.customObjects
      .get({
        queryArgs: {
          limit,
          offset: offset,
          where: whereCondition,
        },
      })
      .execute()
      .then(
        (resp) => [resp.body.results as VariantVersionCustomObject[], resp.body.total!] as const,
      )
  }

  getVersionsWithDraftChanges() {
    return this.ct.customObjects
      .get({
        queryArgs: {
          where: `value(hasDraftChanges = true)`,
        },
      })
      .execute()
      .then((resp) => resp.body.results as VariantVersionCustomObject[])
  }
}
