import { ProductVariant } from '@commercetools/platform-sdk'
import { HttpException } from '@nestjs/common/exceptions/http.exception'

import { VariantVersionsReferenceExtractor } from '../variant-versions-reference-extractor/variant-versions-reference-extractor'

// todo maybe name can be better
export class VariantVersionsHelper {
  private versionIdExtractor = new VariantVersionsReferenceExtractor()

  constructor(private variant: Pick<ProductVariant, 'attributes'>) {}

  hasVersionWithId(versionId: string, throwIfNot?: HttpException): boolean {
    const versionsIds = this.versionIdExtractor.extractVersionsReferencesFromVariant(this.variant)

    const result = Boolean(versionsIds.find((v) => v === versionId))

    if (throwIfNot && !result) {
      throw throwIfNot
    }

    return result
  }
}
