import { ProductVariant } from '@commercetools/platform-sdk'

import { CtAttributesResolver } from '../../../ct-utils/get-attribute-value'
import { VersionReferenceAttribute } from '../../version-reference-attribute'

interface CtCustomObjectReferenceAttribute {
  typeId: string
  id: string
}

export class VariantVersionsReferenceExtractor {
  private commerceToolsVersionAttributeName = VersionReferenceAttribute

  extractVersionsReferencesFromVariant(
    withAttributes: Pick<ProductVariant, 'attributes'>,
  ): string[] {
    const getAttrValue = CtAttributesResolver.constructAttributeValueGetter(
      withAttributes.attributes || [],
    )

    const versionsAttr = (getAttrValue(this.commerceToolsVersionAttributeName) ||
      []) as CtCustomObjectReferenceAttribute[]

    return (
      versionsAttr
        /**
         * Ensure only proper attribute was set - maybe its not needed?
         */
        .filter((attr) => attr.typeId === 'key-value-document')
        .map((attr) => attr.id)
    )
  }
}
