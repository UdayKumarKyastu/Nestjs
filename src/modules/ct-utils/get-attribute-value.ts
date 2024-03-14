import { Attribute } from '@commercetools/platform-sdk'

import { AbstractAttribute } from '../product-attributes/base-attributes/abstract-attribute'

type AttributeBase = Pick<typeof AbstractAttribute, 'COMMERCE_TOOLS_ATTR_NAME'>

export abstract class CtAttributesResolver {
  static constructAttributeValueGetter =
    (attributes: Attribute[]) =>
    <ArgumentType = unknown>(keyOrAttribute: string | AttributeBase): ArgumentType => {
      try {
        const attrNameFromObj: string = (keyOrAttribute as any)['COMMERCE_TOOLS_ATTR_NAME']

        if (typeof attrNameFromObj !== 'string') {
          throw new Error()
        }

        return attributes.find((attr) => attr.name === attrNameFromObj)?.value
      } catch (e) {}

      return attributes.find((attr) => attr.name === keyOrAttribute)?.value as ArgumentType
    }
}
