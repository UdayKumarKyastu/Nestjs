import { VariantReviewStatus } from '../models/variant-review-status'

export class VariantReviewStatusBuilder {
  private readonly reviewStatuses: VariantReviewStatus = {
    marketing: {},
    labelling: null,
    reporting: {},
    prices: [],
    attributes: {},
  }

  withMarketing(marketing: VariantReviewStatus['marketing']) {
    this.reviewStatuses.marketing = marketing

    return this
  }

  withLabelling(labelling: VariantReviewStatus['labelling']) {
    this.reviewStatuses.labelling = labelling

    return this
  }

  withReporting(reporting: VariantReviewStatus['reporting']) {
    this.reviewStatuses.reporting = reporting

    return this
  }

  withPrices(prices: VariantReviewStatus['prices']) {
    this.reviewStatuses.prices = prices

    return this
  }

  withAttributes(attributes: VariantReviewStatus['attributes']) {
    this.reviewStatuses.attributes = attributes

    return this
  }

  build() {
    return { ...this.reviewStatuses }
  }
}
