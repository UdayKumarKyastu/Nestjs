import { VariantVersionPortalFields } from '../../model/version-custom-object'
import { VariantLabelling } from '../../../../shared/model/variant-labelling'

export class VersionObjectCompletionChecker {
  constructor(
    private fields: Omit<VariantVersionPortalFields, 'labelling'> & {
      labelling?: VariantLabelling
    },
  ) {}

  isLabellingSectionComplete() {
    return Boolean(this.fields.labelling)
  }

  isReportingSectionComplete() {
    return Boolean(this.fields.reporting)
  }

  isPricingSectionComplete() {
    return Boolean(this.fields.pricing)
  }

  isBaristaAttributesSectionComplete() {
    return Boolean(this.fields.baristaAttributes)
  }

  isMarketingSectionComplete() {
    const { howToDisplay, description, name, availability } = this.fields

    return Boolean(howToDisplay && description && name && availability)
  }
}
