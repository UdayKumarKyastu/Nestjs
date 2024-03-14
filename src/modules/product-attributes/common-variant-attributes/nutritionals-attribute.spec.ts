import { NutritionalsAttribute } from './nutritionals-attribute'

describe('NutritionalsAttribute', function () {
  it('Properly writes toJSON', () => {
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
    ])

    expect(attr.toJSON()).toMatchInlineSnapshot(`
      Object {
        "value": Array [
          Array [
            Object {
              "name": "item",
              "value": Object {
                "key": "Protein",
                "label": "Protein",
              },
            },
            Object {
              "name": "localizedLabel",
              "value": Object {
                "key": "Protein",
                "label": Object {
                  "en": "Protein",
                  "en-GB": "Protein",
                },
              },
            },
            Object {
              "name": "per100g",
              "value": 20,
            },
            Object {
              "name": "perServing",
              "value": 10,
            },
          ],
        ],
      }
    `)
  })
})
