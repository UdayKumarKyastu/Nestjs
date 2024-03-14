import { MultiLangStringMockFactory } from '../../modules/product/logic/models/multilang-string'
import { NutritionalsAttribute } from '../../modules/product-attributes/common-variant-attributes/nutritionals-attribute'

import { Nutritional, NutritionalsMapper } from './nutritional'

describe('Nutritionals', function () {
  it('Creates instance of Nutritional via constructor', () => {
    const nut = new Nutritional({
      item: 'PROTEIN',
      per100g: 20,
      localizedLabel: MultiLangStringMockFactory.createMultiLangString('Protein'),
      perServing: 10,
    })

    expect(nut).toMatchInlineSnapshot(`
      Nutritional {
        "_tag": "Nutritional",
        "code": "PROTEIN",
        "localizedLabel": MultilangString {
          "en-GB": "Protein-en-GB",
          "en-HK": "Protein-en-HK",
          "en-US": "Protein-en-US",
          "fr-FR": "Protein-fr-FR",
          "zh-HK": "Protein-zh-HK",
        },
        "per100g": 20,
        "perServing": 10,
      }
    `)
  })

  describe('NutritionalsMapper', () => {
    it('Creates nutritionals from ct attribute', () => {
      const attr = new NutritionalsAttribute([
        [
          {
            name: 'item',
            value: {
              key: 'Protein',
              label: 'Protein',
            },
          },
          {
            name: 'localizedLabel',
            value: {
              key: 'Protein',
              label: {
                en: 'Protein',
                'en-GB': 'Protein',
              },
            },
          },
          {
            name: 'per100g',
            value: 20,
          },
          {
            name: 'perServing',
            value: 10,
          },
        ],
        [
          {
            name: 'item',
            value: {
              key: 'Salt',
              label: 'Salt',
            },
          },
          {
            name: 'localizedLabel',
            value: {
              key: 'Salt',
              label: {
                en: 'Salt',
                'en-GB': 'Salt',
              },
            },
          },
          {
            name: 'per100g',
            value: 1,
          },
          {
            name: 'perServing',
            value: 0.1,
          },
        ],
      ])

      const nutrtitionals = NutritionalsMapper.mapNutritionalsAttributeToModel(attr)

      expect(nutrtitionals).toMatchInlineSnapshot(`
        Array [
          Nutritional {
            "_tag": "Nutritional",
            "code": "Protein",
            "localizedLabel": MultilangString {
              "en-GB": "Protein",
              "en-HK": "",
              "en-US": "",
              "fr-FR": "",
              "zh-HK": "",
            },
            "per100g": 20,
            "perServing": 10,
          },
          Nutritional {
            "_tag": "Nutritional",
            "code": "Salt",
            "localizedLabel": MultilangString {
              "en-GB": "Salt",
              "en-HK": "",
              "en-US": "",
              "fr-FR": "",
              "zh-HK": "",
            },
            "per100g": 1,
            "perServing": 0.1,
          },
        ]
      `)
    })
  })
})
