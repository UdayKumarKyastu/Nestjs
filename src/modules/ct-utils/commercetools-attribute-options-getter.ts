import { AttributePlainEnumValue } from '@commercetools/platform-sdk'
import { AttributeDefinition } from '@commercetools/platform-sdk/dist/generated/models/product-type'

type EnumGetter = (
  attributes: AttributeDefinition[],
) => (attrName: string) => AttributePlainEnumValue[]

const getOptionsForEnum: EnumGetter = (attributes: AttributeDefinition[]) => (attrName: string) => {
  const attribute = attributes.find((attr) => attr.name === attrName)

  if (!attribute) {
    throw new Error(`Trying to get attribute ${attrName} but no such attribute was found!`)
  }

  if (attribute.type.name !== 'enum') {
    throw new Error(
      `Trying to get attribute ${attrName} values as ENUM but its type is ${attribute.type.name}`,
    )
  }

  return attribute.type.values
}

const getOptionsForSet: EnumGetter = (attributes: AttributeDefinition[]) => (attrName: string) => {
  const attribute = attributes.find((attr) => attr.name === attrName)

  if (!attribute) {
    throw new Error(`Trying to get attribute ${attrName} but no such attribute was found!`)
  }

  if (attribute.type.name !== 'set' || attribute.type.elementType.name !== 'enum') {
    throw new Error(
      `Trying to get attribute ${attrName} values as SET of ENUM but its type is ${attribute.type.name}`,
    )
  }

  return attribute.type.elementType.values
}

const getAttributeOptions =
  (attrType: 'enum' | 'set') => (attributes: AttributeDefinition[]) => (attrName: string) => {
    let getter: EnumGetter

    switch (attrType) {
      case 'enum':
        getter = getOptionsForEnum

        break
      case 'set':
        getter = getOptionsForSet

        break
    }

    return getter(attributes)(attrName)
  }

export abstract class CommerceToolsAttributeOptionsGetter {
  static getAttributeOptions = getAttributeOptions
}
