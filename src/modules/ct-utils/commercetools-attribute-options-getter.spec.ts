import { AttributeDefinition } from '@commercetools/platform-sdk/dist/generated/models/product-type'

import { CommerceToolsAttributeOptionsGetter } from './commercetools-attribute-options-getter'

const getEnumAttr = (): AttributeDefinition => ({
  name: 'enum_attr',
  isRequired: false,
  isSearchable: true,
  attributeConstraint: 'None',
  inputHint: 'SingleLine',
  label: {
    en: 'Enum attr eng',
  },
  type: {
    name: 'enum',
    values: [
      {
        key: 'KEY1',
        label: 'Attribute label 1',
      },
      {
        key: 'KEY2',
        label: 'Attribute label 2',
      },
    ],
  },
})

const getSETAttr = (): AttributeDefinition => ({
  name: 'set_attr',
  isRequired: false,
  isSearchable: true,
  attributeConstraint: 'None',
  inputHint: 'SingleLine',
  label: {
    en: 'Set attr eng',
  },
  type: {
    name: 'set',
    elementType: {
      name: 'enum',
      values: [
        {
          key: 'SET_KEY_1',
          label: 'Set label 1',
        },
        {
          key: 'SET_KEY_2',
          label: 'Set label 2',
        },
      ],
    },
  },
})

describe('CommerceToolsAttributeOptionsGetter', () => {
  describe('ENUM getter', () => {
    it('Returns enum options', () => {
      const attrs: AttributeDefinition[] = [getEnumAttr()]

      const result =
        CommerceToolsAttributeOptionsGetter.getAttributeOptions('enum')(attrs)('enum_attr')

      expect(result).toEqual([
        {
          key: 'KEY1',
          label: 'Attribute label 1',
        },
        {
          key: 'KEY2',
          label: 'Attribute label 2',
        },
      ])
    })

    it('Should throw if attribute not found', () => {
      expect(() =>
        CommerceToolsAttributeOptionsGetter.getAttributeOptions('enum')([getEnumAttr()])(
          'NotExistingAttr',
        ),
      ).toThrow()
    })
  })

  describe('SET getter', () => {
    it('Returns SET options', () => {
      const attrs: AttributeDefinition[] = [getSETAttr()]

      const result =
        CommerceToolsAttributeOptionsGetter.getAttributeOptions('set')(attrs)('set_attr')

      expect(result).toEqual([
        {
          key: 'SET_KEY_1',
          label: 'Set label 1',
        },
        {
          key: 'SET_KEY_2',
          label: 'Set label 2',
        },
      ])
    })

    it('Should throw if attribute not found', () => {
      expect(() =>
        CommerceToolsAttributeOptionsGetter.getAttributeOptions('set')([getSETAttr()])(
          'NotExistingAttr',
        ),
      ).toThrow()
    })
  })
})
