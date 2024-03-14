import { Product } from '@commercetools/platform-sdk'

export default {
  id: 'ecd46fc5-00b3-4ea9-b0f3-645f5e88f377',
  version: 20086,
  lastMessageSequenceNumber: 231,
  createdAt: '2020-10-30T11:36:23.338Z',
  lastModifiedAt: '2022-02-09T13:21:51.082Z',
  lastModifiedBy: {
    clientId: '0A-18-7_nR91UEm3zI5Uc1qt',
    isPlatformClient: false,
  },
  createdBy: {
    clientId: 'uP_r_H951qS2PFmLQJ97PMrw',
    isPlatformClient: false,
  },
  productType: {
    obj: {
      key: 'barista_beverage',
    },
  },
  masterData: {
    current: {
      name: {
        'en-GB': 'Latte',
      },
      description: {
        'en-GB':
          'Pret’s signature organic espresso combined with silky steamed milk and finished with a light layer of foam. Served as a 12oz drink\r\n\r\nAll our Barista prepared drinks are also available decaffeinated. Both skimmed and semi-skimmed milks are available, as well as milk alternatives',
      },
      categories: [
        {
          typeId: 'category',
          id: '46e4af9c-ebe0-4d01-8710-3dd4818b6561',
        },
        {
          typeId: 'category',
          id: 'c653dadd-ff85-4181-933a-16d7fd325334',
        },
        {
          typeId: 'category',
          id: 'c5d020de-8521-433e-96aa-5662655a27d6',
        },
      ],
      categoryOrderHints: {},
      slug: {
        'en-US': 'UK006780',
        'en-GB': 'UK006780',
      },
      masterVariant: {
        id: 1,
        sku: 'UK006780',
        key: 'UK006780',
        prices: [
          {
            id: '87ccd506-aa0e-4c15-ba3d-5f59c53ecdf2',
            value: {
              type: 'centPrecision',
              currencyCode: 'GBP',
              centAmount: 275,
              fractionDigits: 2,
            },
            channel: {
              typeId: 'channel',
              id: '057d52b1-f72f-4bb9-853c-7e2ab19a11ad',
            },
            custom: {
              type: {
                typeId: 'type',
                id: '2a094ddf-7a7b-46b5-b4af-f89fbcb10a19',
              },
              fields: {
                deliveryPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 355,
                  fractionDigits: 2,
                },
                eatInPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 275,
                  fractionDigits: 2,
                },
                eatInClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 275,
                  fractionDigits: 2,
                },
                takeAwayClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 275,
                  fractionDigits: 2,
                },
                deliveryTax: 0.125,
                eatInTax: 0.125,
              },
            },
          },
          {
            id: 'edc143ff-3902-4414-bb6a-a7e630071687',
            value: {
              type: 'centPrecision',
              currencyCode: 'GBP',
              centAmount: 285,
              fractionDigits: 2,
            },
            channel: {
              typeId: 'channel',
              id: '7880620c-36ef-4613-bac5-3bbe501ec029',
            },
            custom: {
              type: {
                typeId: 'type',
                id: '2a094ddf-7a7b-46b5-b4af-f89fbcb10a19',
              },
              fields: {
                eatInTax: 0.125,
                eatInPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 285,
                  fractionDigits: 2,
                },
                eatInClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 285,
                  fractionDigits: 2,
                },
                takeAwayClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 285,
                  fractionDigits: 2,
                },
                deliveryTax: 0.125,
                deliveryPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 355,
                  fractionDigits: 2,
                },
              },
            },
          },
          {
            id: '9694cd26-5256-4157-b134-874631156304',
            value: {
              type: 'centPrecision',
              currencyCode: 'GBP',
              centAmount: 285,
              fractionDigits: 2,
            },
            channel: {
              typeId: 'channel',
              id: 'c4d8fd28-371c-4f68-9030-968212add218',
            },
            custom: {
              type: {
                typeId: 'type',
                id: '2a094ddf-7a7b-46b5-b4af-f89fbcb10a19',
              },
              fields: {
                eatInTax: 0.125,
                eatInPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 285,
                  fractionDigits: 2,
                },
                eatInClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 285,
                  fractionDigits: 2,
                },
                takeAwayClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 285,
                  fractionDigits: 2,
                },
                deliveryTax: 0.125,
                deliveryPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 355,
                  fractionDigits: 2,
                },
              },
            },
          },
          {
            id: '7d61f920-4363-43eb-81c5-d967aed302c8',
            value: {
              type: 'centPrecision',
              currencyCode: 'GBP',
              centAmount: 295,
              fractionDigits: 2,
            },
            channel: {
              typeId: 'channel',
              id: 'b4ecad5d-6c12-4e96-8b05-218e42a87763',
            },
            custom: {
              type: {
                typeId: 'type',
                id: '2a094ddf-7a7b-46b5-b4af-f89fbcb10a19',
              },
              fields: {
                eatInTax: 0.125,
                eatInPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 295,
                  fractionDigits: 2,
                },
                eatInClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 295,
                  fractionDigits: 2,
                },
                takeAwayClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 295,
                  fractionDigits: 2,
                },
                deliveryTax: 0.125,
                deliveryPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 355,
                  fractionDigits: 2,
                },
              },
            },
          },
          {
            id: '611bdefd-3c9c-40c0-8eae-fb71c07c64da',
            value: {
              type: 'centPrecision',
              currencyCode: 'GBP',
              centAmount: 305,
              fractionDigits: 2,
            },
            channel: {
              typeId: 'channel',
              id: 'a5641477-508f-449a-93ef-0b533f77d070',
            },
            custom: {
              type: {
                typeId: 'type',
                id: '2a094ddf-7a7b-46b5-b4af-f89fbcb10a19',
              },
              fields: {
                eatInTax: 0.125,
                eatInPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 305,
                  fractionDigits: 2,
                },
                eatInClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 305,
                  fractionDigits: 2,
                },
                takeAwayClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 305,
                  fractionDigits: 2,
                },
                deliveryTax: 0.125,
                deliveryPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 355,
                  fractionDigits: 2,
                },
              },
            },
          },
          {
            id: '0a06e604-0e1c-430a-a562-1e1544334635',
            value: {
              type: 'centPrecision',
              currencyCode: 'GBP',
              centAmount: 0,
              fractionDigits: 2,
            },
            channel: {
              typeId: 'channel',
              id: 'd1d2bc59-347f-4919-a8cb-93b02aab0137',
            },
            custom: {
              type: {
                typeId: 'type',
                id: '2a094ddf-7a7b-46b5-b4af-f89fbcb10a19',
              },
              fields: {
                eatInTax: 0,
                eatInPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                eatInClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                takeAwayClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                deliveryTax: 0.125,
                deliveryPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 355,
                  fractionDigits: 2,
                },
              },
            },
          },
          {
            id: 'cc57ae2f-7bfb-4bc5-b88d-c4fa85693d77',
            value: {
              type: 'centPrecision',
              currencyCode: 'GBP',
              centAmount: 0,
              fractionDigits: 2,
            },
            channel: {
              typeId: 'channel',
              id: '7855a57e-9ca0-4e4b-aaa1-2315dbffba85',
            },
            custom: {
              type: {
                typeId: 'type',
                id: '2a094ddf-7a7b-46b5-b4af-f89fbcb10a19',
              },
              fields: {
                eatInTax: 0,
                eatInPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                eatInClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                takeAwayClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                deliveryTax: 0.125,
                deliveryPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 355,
                  fractionDigits: 2,
                },
              },
            },
          },
          {
            id: '52af7947-2ede-430a-95ff-193945415d77',
            value: {
              type: 'centPrecision',
              currencyCode: 'GBP',
              centAmount: 0,
              fractionDigits: 2,
            },
            channel: {
              typeId: 'channel',
              id: '3b8aaf44-5220-4dd2-bfdf-13b417a5de07',
            },
            custom: {
              type: {
                typeId: 'type',
                id: '2a094ddf-7a7b-46b5-b4af-f89fbcb10a19',
              },
              fields: {
                eatInPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                eatInClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                takeAwayClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                deliveryTax: 0.05,
                eatInTax: 0.05,
                takeAwayTax: 0.05,
                deliveryPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 305,
                  fractionDigits: 2,
                },
              },
            },
          },
          {
            id: 'd8810649-1f07-4790-b2c4-2b3aac9373d6',
            value: {
              type: 'centPrecision',
              currencyCode: 'GBP',
              centAmount: 0,
              fractionDigits: 2,
            },
            channel: {
              typeId: 'channel',
              id: '60a901fe-8047-48bf-9080-6944094379b4',
            },
            custom: {
              type: {
                typeId: 'type',
                id: '2a094ddf-7a7b-46b5-b4af-f89fbcb10a19',
              },
              fields: {
                eatInPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                eatInClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                takeAwayClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                deliveryTax: 0.05,
                eatInTax: 0.05,
                takeAwayTax: 0.05,
                deliveryPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 305,
                  fractionDigits: 2,
                },
              },
            },
          },
          {
            id: 'd855555e-a1a8-4c35-ac3c-6fa65aee9d66',
            value: {
              type: 'centPrecision',
              currencyCode: 'GBP',
              centAmount: 0,
              fractionDigits: 2,
            },
            channel: {
              typeId: 'channel',
              id: 'a56f9881-407c-440f-9c79-b311504a0d60',
            },
            custom: {
              type: {
                typeId: 'type',
                id: '2a094ddf-7a7b-46b5-b4af-f89fbcb10a19',
              },
              fields: {
                eatInPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                eatInClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                takeAwayClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                deliveryTax: 0.05,
                eatInTax: 0.05,
                takeAwayTax: 0.05,
                deliveryPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 305,
                  fractionDigits: 2,
                },
              },
            },
          },
        ],
        images: [],
        attributes: [
          {
            name: 'nutritionals',
            value: [
              [
                {
                  name: 'item',
                  value: {
                    key: 'Energy (KJ)',
                    label: 'Energy (KJ)',
                  },
                },
                {
                  name: 'localizedLabel',
                  value: {
                    key: 'Energy (KJ)',
                    label: {
                      'en-GB': 'Energy (KJ)',
                      en: 'Energy (KJ)',
                      'zh-HK': '熱量(千焦)',
                      'fr-FR': 'Énergie (KJ)',
                      'en-US': 'Kilojoules',
                    },
                  },
                },
                {
                  name: 'per100g',
                  value: 149.7,
                },
                {
                  name: 'perServing',
                  value: 494.0,
                },
              ],
              [
                {
                  name: 'item',
                  value: {
                    key: 'Energy (KCal)',
                    label: 'Energy (KCal)',
                  },
                },
                {
                  name: 'localizedLabel',
                  value: {
                    key: 'Energy (KCal)',
                    label: {
                      'en-GB': 'Energy (Kcal)',
                      en: 'Energy (Kcal)',
                      'zh-HK': '能量  (千卡)',
                      'fr-FR': 'Énergie (kcal)',
                      'en-US': 'Calories',
                    },
                  },
                },
                {
                  name: 'per100g',
                  value: 35.8,
                },
                {
                  name: 'perServing',
                  value: 118.0,
                },
              ],
              [
                {
                  name: 'item',
                  value: {
                    key: 'Fat',
                    label: 'Fat',
                  },
                },
                {
                  name: 'localizedLabel',
                  value: {
                    key: 'Fat',
                    label: {
                      'en-GB': 'Fat (g)',
                      en: 'Fat (g)',
                      'zh-HK': '脂肪 (克)',
                      'fr-FR': 'Matières grasses (g)',
                      'en-US': 'Total Fat (g)',
                    },
                  },
                },
                {
                  name: 'per100g',
                  value: 1.3,
                },
                {
                  name: 'perServing',
                  value: 4.3,
                },
              ],
              [
                {
                  name: 'item',
                  value: {
                    key: 'Saturates',
                    label: 'Saturates',
                  },
                },
                {
                  name: 'localizedLabel',
                  value: {
                    key: 'Saturates',
                    label: {
                      'en-GB': 'of which saturates (g)',
                      en: 'of which saturates (g)',
                      'zh-HK': '飽和脂肪 (克)',
                      'fr-FR': 'dont Acides gras saturés (g)',
                      'en-US': 'Saturated Fat (g)',
                    },
                  },
                },
                {
                  name: 'per100g',
                  value: 0.8,
                },
                {
                  name: 'perServing',
                  value: 2.7,
                },
              ],
              [
                {
                  name: 'item',
                  value: {
                    key: 'Carbohydrates',
                    label: 'Carbohydrates',
                  },
                },
                {
                  name: 'localizedLabel',
                  value: {
                    key: 'Carbohydrates',
                    label: {
                      'en-GB': 'Carbohydrates (g)',
                      en: 'Carbohydrates (g)',
                      'zh-HK': '碳水化合物 (克)',
                      'fr-FR': 'Glucides (g)',
                      'en-US': 'Carbohydrate (g)',
                    },
                  },
                },
                {
                  name: 'per100g',
                  value: 3.4,
                },
                {
                  name: 'perServing',
                  value: 11.3,
                },
              ],
              [
                {
                  name: 'item',
                  value: {
                    key: 'Sugars',
                    label: 'Sugars',
                  },
                },
                {
                  name: 'localizedLabel',
                  value: {
                    key: 'Sugars',
                    label: {
                      'en-GB': 'of which sugars (g)',
                      en: 'of which sugars (g)',
                      'zh-HK': '糖 (克)',
                      'fr-FR': 'dont Sucres (g)',
                      'en-US': 'Total Sugars (g)',
                    },
                  },
                },
                {
                  name: 'per100g',
                  value: 3.4,
                },
                {
                  name: 'perServing',
                  value: 11.3,
                },
              ],
              [
                {
                  name: 'item',
                  value: {
                    key: 'Dietary Fibre',
                    label: 'Dietary Fibre',
                  },
                },
                {
                  name: 'localizedLabel',
                  value: {
                    key: 'Dietary Fibre',
                    label: {
                      'en-GB': 'Fibre (g)',
                      en: 'Fibre (g)',
                      'zh-HK': '膳食纖維 (克)',
                      'fr-FR': 'Fibres alimentaires (g)',
                      'en-US': 'Dietary Fiber (g)',
                    },
                  },
                },
                {
                  name: 'per100g',
                  value: 0.0,
                },
                {
                  name: 'perServing',
                  value: 0.0,
                },
              ],
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
                      'en-GB': 'Protein (g)',
                      en: 'Protein (g)',
                      'zh-HK': '蛋白質 (克)',
                      'fr-FR': 'Protéines (g)',
                      'en-US': 'Protein (g)',
                    },
                  },
                },
                {
                  name: 'per100g',
                  value: 2.6,
                },
                {
                  name: 'perServing',
                  value: 8.5,
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
                      'en-GB': 'Salt (g)',
                      en: 'Salt (g)',
                      'zh-HK': '鹽 (克)',
                      'fr-FR': 'Sel (g)',
                      'en-US': 'Salt (g)',
                    },
                  },
                },
                {
                  name: 'per100g',
                  value: 0.1,
                },
                {
                  name: 'perServing',
                  value: 0.3,
                },
              ],
              [
                {
                  name: 'item',
                  value: {
                    key: 'Sodium',
                    label: 'Sodium',
                  },
                },
                {
                  name: 'localizedLabel',
                  value: {
                    key: 'Sodium',
                    label: {
                      'en-GB': 'Sodium (mg)',
                      en: 'Sodium (mg)',
                      'zh-HK': '鈉 (毫克)',
                      'fr-FR': 'Sodium (mg)',
                      'en-US': 'Sodium (mg)',
                    },
                  },
                },
                {
                  name: 'per100g',
                  value: 36.4,
                },
                {
                  name: 'perServing',
                  value: 120.0,
                },
              ],
            ],
          },
          {
            name: 'ingredients',
            value: {
              'en-US': 'Semi-skimmed / Skimmed Milk (<b>Milk</b>), Espresso.',
              'en-GB': 'Semi-skimmed / Skimmed Milk (<b>Milk</b>), Espresso.',
            },
          },
          {
            name: 'description',
            value: {
              'en-GB':
                'Pret’s signature organic espresso combined with silky steamed milk and finished with a light layer of foam. Served as a 12oz drink\r\n\r\nAll our Barista prepared drinks are also available decaffeinated. Both skimmed and semi-skimmed milks are available, as well as milk alternatives',
            },
          },
          {
            name: 'longDescription',
            value: {
              en: 'Pret’s signature organic espresso combined with silky steamed milk and finished with a light layer of foam. Served as a 12oz drink\r\n\r\nAll our Barista prepared drinks are also available decaffeinated. Both skimmed and semi-skimmed milks are available, as well as milk alternatives',
              'en-GB':
                'Pret’s signature organic espresso combined with silky steamed milk and finished with a light layer of foam. Served as a 12oz drink\r\n\r\nAll our Barista prepared drinks are also available decaffeinated. Both skimmed and semi-skimmed milks are available, as well as milk alternatives',
              'en-US':
                'Pret’s signature organic espresso combined with silky steamed milk and finished with a light layer of foam. Served as a 12oz drink\r\n\r\nAll our Barista prepared drinks are also available decaffeinated. Both skimmed and semi-skimmed milks are available, as well as milk alternatives',
            },
          },
          {
            name: 'suitableForVegetarians',
            value: true,
          },
          {
            name: 'suitableForVegans',
            value: false,
          },
          {
            name: 'containsAllergens',
            value: ['Milk'],
          },
          {
            name: 'localizedContainsAllergens',
            value: [
              {
                key: 'Milk',
                label: {
                  'en-GB': 'Milk',
                  en: 'Milk',
                  'zh-HK': '奶類',
                  'fr-FR': 'Lait',
                  'en-US': 'Milk',
                },
              },
            ],
          },
          {
            name: 'visible',
            value: true,
          },
          {
            name: 'country',
            value: {
              key: 'UK',
              label: 'United Kingdom',
            },
          },
          {
            name: 'posId',
            value: '8266780',
          },
          {
            name: 'availableForCollection',
            value: true,
          },
          {
            name: 'averageWeight',
            value: 330.0,
          },
          {
            name: 'sourceSystemLastUpdated',
            value: '2021-09-09T13:26:59.000Z',
          },
          {
            name: 'newUntil',
            value: '2020-09-08',
          },
          {
            name: 'canHaveVariants',
            value: true,
          },
          {
            name: 'requiresBlender',
            value: false,
          },
          {
            name: 'canBeDecaf',
            value: true,
          },
          {
            name: 'requiresIceMachine',
            value: false,
          },
          {
            name: 'canAddSyrup',
            value: true,
          },
          {
            name: 'canAddExtraShot',
            value: true,
          },
          {
            name: 'canAddWhippedCream',
            value: false,
          },
          {
            name: 'canBeBlack',
            value: false,
          },
          {
            name: 'milkCanBeSemiSkimmed',
            value: true,
          },
          {
            name: 'milkCanBeSkimmed',
            value: true,
          },
          {
            name: 'milkCanBeOat',
            value: true,
          },
          {
            name: 'milkCanBeRiceCoconut',
            value: true,
          },
          {
            name: 'milkCanBeSoya',
            value: true,
          },
          {
            name: 'isDecaf',
            value: false,
          },
          {
            name: 'isDecafPod',
            value: false,
          },
          {
            name: 'milkIsSemiSkimmed',
            value: true,
          },
          {
            name: 'milkIsSkimmed',
            value: false,
          },
          {
            name: 'milkIsOat',
            value: false,
          },
          {
            name: 'milkIsRiceCoconut',
            value: false,
          },
          {
            name: 'milkIsSoya',
            value: false,
          },
          {
            name: 'isBlack',
            value: false,
          },
          {
            name: 'variantName',
            value: {
              'en-GB': 'Latte',
            },
          },
          {
            name: 'availableForOutposts',
            value: false,
          },
          {
            name: 'externalTaxCode',
            value: 'PF051906',
          },
          {
            name: 'availableForPretDelivers',
            value: true,
          },
          {
            name: 'pretDeliversAvailableAllDay',
            value: true,
          },
          {
            name: 'pluReportingName',
            value: 'Coffee - 12oz Latte',
          },
          {
            name: 'pluPrimaryCategory',
            value: {
              key: 'HotDrinks',
              label: 'HOT DRINKS',
            },
          },
          {
            name: 'pluSecondaryCategory',
            value: {
              key: 'Coffee',
              label: 'COFFEE',
            },
          },
          {
            name: 'productCategory',
            value: {
              key: 'HotDrinks',
              label: 'HOT DRINKS',
            },
          },
          {
            name: 'productSubCategory',
            value: {
              key: 'HotDrinks',
              label: 'HOT DRINKS',
            },
          },
          {
            name: 'visibleOnDeliveryWebsite',
            value: true,
          },
          {
            name: 'liveFrom',
            value: '2017-12-29',
          },
          {
            name: 'chefSpecial',
            value: false,
          },
          {
            name: 'displayAsNew',
            value: false,
          },
          {
            name: 'hgCode',
            value: 'FP00001148',
          },
          {
            name: 'howToDisplay',
            value: [
              {
                key: 'NA',
                label: 'N/A',
              },
            ],
          },
          {
            name: 'toppings',
            value: [],
          },
          {
            name: 'extras',
            value: ['UK006648'],
          },
          {
            name: 'syrups',
            value: ['UK003991', 'UK003990', 'UK003989', 'UK007293', 'UK008278', 'UK008308'],
          },
        ],
        assets: [],
      },
      searchKeywords: {},
    },
    staged: {
      name: {
        'en-GB': 'Latte',
      },
      description: {
        'en-GB':
          'Pret’s signature organic espresso combined with silky steamed milk and finished with a light layer of foam. Served as a 12oz drink\r\n\r\nAll our Barista prepared drinks are also available decaffeinated. Both skimmed and semi-skimmed milks are available, as well as milk alternatives',
      },
      categories: [
        {
          typeId: 'category',
          id: '46e4af9c-ebe0-4d01-8710-3dd4818b6561',
        },
        {
          typeId: 'category',
          id: 'c653dadd-ff85-4181-933a-16d7fd325334',
        },
        {
          typeId: 'category',
          id: 'c5d020de-8521-433e-96aa-5662655a27d6',
        },
      ],
      categoryOrderHints: {},
      slug: {
        'en-US': 'UK006780',
        'en-GB': 'UK006780',
      },
      masterVariant: {
        id: 1,
        sku: 'UK006780',
        key: 'UK006780',
        prices: [
          {
            id: '87ccd506-aa0e-4c15-ba3d-5f59c53ecdf2',
            value: {
              type: 'centPrecision',
              currencyCode: 'GBP',
              centAmount: 275,
              fractionDigits: 2,
            },
            channel: {
              typeId: 'channel',
              id: '057d52b1-f72f-4bb9-853c-7e2ab19a11ad',
            },
            custom: {
              type: {
                typeId: 'type',
                id: '2a094ddf-7a7b-46b5-b4af-f89fbcb10a19',
              },
              fields: {
                deliveryPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 355,
                  fractionDigits: 2,
                },
                eatInPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 275,
                  fractionDigits: 2,
                },
                eatInClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 275,
                  fractionDigits: 2,
                },
                takeAwayClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 275,
                  fractionDigits: 2,
                },
                deliveryTax: 0.125,
                eatInTax: 0.125,
              },
            },
          },
          {
            id: 'edc143ff-3902-4414-bb6a-a7e630071687',
            value: {
              type: 'centPrecision',
              currencyCode: 'GBP',
              centAmount: 285,
              fractionDigits: 2,
            },
            channel: {
              typeId: 'channel',
              id: '7880620c-36ef-4613-bac5-3bbe501ec029',
            },
            custom: {
              type: {
                typeId: 'type',
                id: '2a094ddf-7a7b-46b5-b4af-f89fbcb10a19',
              },
              fields: {
                eatInTax: 0.125,
                eatInPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 285,
                  fractionDigits: 2,
                },
                eatInClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 285,
                  fractionDigits: 2,
                },
                takeAwayClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 285,
                  fractionDigits: 2,
                },
                deliveryTax: 0.125,
                deliveryPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 355,
                  fractionDigits: 2,
                },
              },
            },
          },
          {
            id: '9694cd26-5256-4157-b134-874631156304',
            value: {
              type: 'centPrecision',
              currencyCode: 'GBP',
              centAmount: 285,
              fractionDigits: 2,
            },
            channel: {
              typeId: 'channel',
              id: 'c4d8fd28-371c-4f68-9030-968212add218',
            },
            custom: {
              type: {
                typeId: 'type',
                id: '2a094ddf-7a7b-46b5-b4af-f89fbcb10a19',
              },
              fields: {
                eatInTax: 0.125,
                eatInPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 285,
                  fractionDigits: 2,
                },
                eatInClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 285,
                  fractionDigits: 2,
                },
                takeAwayClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 285,
                  fractionDigits: 2,
                },
                deliveryTax: 0.125,
                deliveryPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 355,
                  fractionDigits: 2,
                },
              },
            },
          },
          {
            id: '7d61f920-4363-43eb-81c5-d967aed302c8',
            value: {
              type: 'centPrecision',
              currencyCode: 'GBP',
              centAmount: 295,
              fractionDigits: 2,
            },
            channel: {
              typeId: 'channel',
              id: 'b4ecad5d-6c12-4e96-8b05-218e42a87763',
            },
            custom: {
              type: {
                typeId: 'type',
                id: '2a094ddf-7a7b-46b5-b4af-f89fbcb10a19',
              },
              fields: {
                eatInTax: 0.125,
                eatInPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 295,
                  fractionDigits: 2,
                },
                eatInClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 295,
                  fractionDigits: 2,
                },
                takeAwayClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 295,
                  fractionDigits: 2,
                },
                deliveryTax: 0.125,
                deliveryPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 355,
                  fractionDigits: 2,
                },
              },
            },
          },
          {
            id: '611bdefd-3c9c-40c0-8eae-fb71c07c64da',
            value: {
              type: 'centPrecision',
              currencyCode: 'GBP',
              centAmount: 305,
              fractionDigits: 2,
            },
            channel: {
              typeId: 'channel',
              id: 'a5641477-508f-449a-93ef-0b533f77d070',
            },
            custom: {
              type: {
                typeId: 'type',
                id: '2a094ddf-7a7b-46b5-b4af-f89fbcb10a19',
              },
              fields: {
                eatInTax: 0.125,
                eatInPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 305,
                  fractionDigits: 2,
                },
                eatInClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 305,
                  fractionDigits: 2,
                },
                takeAwayClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 305,
                  fractionDigits: 2,
                },
                deliveryTax: 0.125,
                deliveryPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 355,
                  fractionDigits: 2,
                },
              },
            },
          },
          {
            id: '0a06e604-0e1c-430a-a562-1e1544334635',
            value: {
              type: 'centPrecision',
              currencyCode: 'GBP',
              centAmount: 0,
              fractionDigits: 2,
            },
            channel: {
              typeId: 'channel',
              id: 'd1d2bc59-347f-4919-a8cb-93b02aab0137',
            },
            custom: {
              type: {
                typeId: 'type',
                id: '2a094ddf-7a7b-46b5-b4af-f89fbcb10a19',
              },
              fields: {
                eatInTax: 0,
                eatInPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                eatInClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                takeAwayClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                deliveryTax: 0.125,
                deliveryPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 355,
                  fractionDigits: 2,
                },
              },
            },
          },
          {
            id: 'cc57ae2f-7bfb-4bc5-b88d-c4fa85693d77',
            value: {
              type: 'centPrecision',
              currencyCode: 'GBP',
              centAmount: 0,
              fractionDigits: 2,
            },
            channel: {
              typeId: 'channel',
              id: '7855a57e-9ca0-4e4b-aaa1-2315dbffba85',
            },
            custom: {
              type: {
                typeId: 'type',
                id: '2a094ddf-7a7b-46b5-b4af-f89fbcb10a19',
              },
              fields: {
                eatInTax: 0,
                eatInPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                eatInClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                takeAwayClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                deliveryTax: 0.125,
                deliveryPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 355,
                  fractionDigits: 2,
                },
              },
            },
          },
          {
            id: '52af7947-2ede-430a-95ff-193945415d77',
            value: {
              type: 'centPrecision',
              currencyCode: 'GBP',
              centAmount: 0,
              fractionDigits: 2,
            },
            channel: {
              typeId: 'channel',
              id: '3b8aaf44-5220-4dd2-bfdf-13b417a5de07',
            },
            custom: {
              type: {
                typeId: 'type',
                id: '2a094ddf-7a7b-46b5-b4af-f89fbcb10a19',
              },
              fields: {
                eatInPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                eatInClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                takeAwayClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                deliveryTax: 0.05,
                eatInTax: 0.05,
                takeAwayTax: 0.05,
                deliveryPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 305,
                  fractionDigits: 2,
                },
              },
            },
          },
          {
            id: 'd8810649-1f07-4790-b2c4-2b3aac9373d6',
            value: {
              type: 'centPrecision',
              currencyCode: 'GBP',
              centAmount: 0,
              fractionDigits: 2,
            },
            channel: {
              typeId: 'channel',
              id: '60a901fe-8047-48bf-9080-6944094379b4',
            },
            custom: {
              type: {
                typeId: 'type',
                id: '2a094ddf-7a7b-46b5-b4af-f89fbcb10a19',
              },
              fields: {
                eatInPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                eatInClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                takeAwayClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                deliveryTax: 0.05,
                eatInTax: 0.05,
                takeAwayTax: 0.05,
                deliveryPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 305,
                  fractionDigits: 2,
                },
              },
            },
          },
          {
            id: 'd855555e-a1a8-4c35-ac3c-6fa65aee9d66',
            value: {
              type: 'centPrecision',
              currencyCode: 'GBP',
              centAmount: 0,
              fractionDigits: 2,
            },
            channel: {
              typeId: 'channel',
              id: 'a56f9881-407c-440f-9c79-b311504a0d60',
            },
            custom: {
              type: {
                typeId: 'type',
                id: '2a094ddf-7a7b-46b5-b4af-f89fbcb10a19',
              },
              fields: {
                eatInPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                eatInClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                takeAwayClubPret: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 0,
                  fractionDigits: 2,
                },
                deliveryTax: 0.05,
                eatInTax: 0.05,
                takeAwayTax: 0.05,
                deliveryPrice: {
                  type: 'centPrecision',
                  currencyCode: 'GBP',
                  centAmount: 305,
                  fractionDigits: 2,
                },
              },
            },
          },
        ],
        images: [],
        attributes: [
          {
            name: 'nutritionals',
            value: [
              [
                {
                  name: 'item',
                  value: {
                    key: 'Energy (KJ)',
                    label: 'Energy (KJ)',
                  },
                },
                {
                  name: 'localizedLabel',
                  value: {
                    key: 'Energy (KJ)',
                    label: {
                      'en-GB': 'Energy (KJ)',
                      en: 'Energy (KJ)',
                      'zh-HK': '熱量(千焦)',
                      'fr-FR': 'Énergie (KJ)',
                      'en-US': 'Kilojoules',
                    },
                  },
                },
                {
                  name: 'per100g',
                  value: 149.7,
                },
                {
                  name: 'perServing',
                  value: 494.0,
                },
              ],
              [
                {
                  name: 'item',
                  value: {
                    key: 'Energy (KCal)',
                    label: 'Energy (KCal)',
                  },
                },
                {
                  name: 'localizedLabel',
                  value: {
                    key: 'Energy (KCal)',
                    label: {
                      'en-GB': 'Energy (Kcal)',
                      en: 'Energy (Kcal)',
                      'zh-HK': '能量  (千卡)',
                      'fr-FR': 'Énergie (kcal)',
                      'en-US': 'Calories',
                    },
                  },
                },
                {
                  name: 'per100g',
                  value: 35.8,
                },
                {
                  name: 'perServing',
                  value: 118.0,
                },
              ],
              [
                {
                  name: 'item',
                  value: {
                    key: 'Fat',
                    label: 'Fat',
                  },
                },
                {
                  name: 'localizedLabel',
                  value: {
                    key: 'Fat',
                    label: {
                      'en-GB': 'Fat (g)',
                      en: 'Fat (g)',
                      'zh-HK': '脂肪 (克)',
                      'fr-FR': 'Matières grasses (g)',
                      'en-US': 'Total Fat (g)',
                    },
                  },
                },
                {
                  name: 'per100g',
                  value: 1.3,
                },
                {
                  name: 'perServing',
                  value: 4.3,
                },
              ],
              [
                {
                  name: 'item',
                  value: {
                    key: 'Saturates',
                    label: 'Saturates',
                  },
                },
                {
                  name: 'localizedLabel',
                  value: {
                    key: 'Saturates',
                    label: {
                      'en-GB': 'of which saturates (g)',
                      en: 'of which saturates (g)',
                      'zh-HK': '飽和脂肪 (克)',
                      'fr-FR': 'dont Acides gras saturés (g)',
                      'en-US': 'Saturated Fat (g)',
                    },
                  },
                },
                {
                  name: 'per100g',
                  value: 0.8,
                },
                {
                  name: 'perServing',
                  value: 2.7,
                },
              ],
              [
                {
                  name: 'item',
                  value: {
                    key: 'Carbohydrates',
                    label: 'Carbohydrates',
                  },
                },
                {
                  name: 'localizedLabel',
                  value: {
                    key: 'Carbohydrates',
                    label: {
                      'en-GB': 'Carbohydrates (g)',
                      en: 'Carbohydrates (g)',
                      'zh-HK': '碳水化合物 (克)',
                      'fr-FR': 'Glucides (g)',
                      'en-US': 'Carbohydrate (g)',
                    },
                  },
                },
                {
                  name: 'per100g',
                  value: 3.4,
                },
                {
                  name: 'perServing',
                  value: 11.3,
                },
              ],
              [
                {
                  name: 'item',
                  value: {
                    key: 'Sugars',
                    label: 'Sugars',
                  },
                },
                {
                  name: 'localizedLabel',
                  value: {
                    key: 'Sugars',
                    label: {
                      'en-GB': 'of which sugars (g)',
                      en: 'of which sugars (g)',
                      'zh-HK': '糖 (克)',
                      'fr-FR': 'dont Sucres (g)',
                      'en-US': 'Total Sugars (g)',
                    },
                  },
                },
                {
                  name: 'per100g',
                  value: 3.4,
                },
                {
                  name: 'perServing',
                  value: 11.3,
                },
              ],
              [
                {
                  name: 'item',
                  value: {
                    key: 'Dietary Fibre',
                    label: 'Dietary Fibre',
                  },
                },
                {
                  name: 'localizedLabel',
                  value: {
                    key: 'Dietary Fibre',
                    label: {
                      'en-GB': 'Fibre (g)',
                      en: 'Fibre (g)',
                      'zh-HK': '膳食纖維 (克)',
                      'fr-FR': 'Fibres alimentaires (g)',
                      'en-US': 'Dietary Fiber (g)',
                    },
                  },
                },
                {
                  name: 'per100g',
                  value: 0.0,
                },
                {
                  name: 'perServing',
                  value: 0.0,
                },
              ],
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
                      'en-GB': 'Protein (g)',
                      en: 'Protein (g)',
                      'zh-HK': '蛋白質 (克)',
                      'fr-FR': 'Protéines (g)',
                      'en-US': 'Protein (g)',
                    },
                  },
                },
                {
                  name: 'per100g',
                  value: 2.6,
                },
                {
                  name: 'perServing',
                  value: 8.5,
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
                      'en-GB': 'Salt (g)',
                      en: 'Salt (g)',
                      'zh-HK': '鹽 (克)',
                      'fr-FR': 'Sel (g)',
                      'en-US': 'Salt (g)',
                    },
                  },
                },
                {
                  name: 'per100g',
                  value: 0.1,
                },
                {
                  name: 'perServing',
                  value: 0.3,
                },
              ],
              [
                {
                  name: 'item',
                  value: {
                    key: 'Sodium',
                    label: 'Sodium',
                  },
                },
                {
                  name: 'localizedLabel',
                  value: {
                    key: 'Sodium',
                    label: {
                      'en-GB': 'Sodium (mg)',
                      en: 'Sodium (mg)',
                      'zh-HK': '鈉 (毫克)',
                      'fr-FR': 'Sodium (mg)',
                      'en-US': 'Sodium (mg)',
                    },
                  },
                },
                {
                  name: 'per100g',
                  value: 36.4,
                },
                {
                  name: 'perServing',
                  value: 120.0,
                },
              ],
            ],
          },
          {
            name: 'ingredients',
            value: {
              'en-US': 'Semi-skimmed / Skimmed Milk (<b>Milk</b>), Espresso.',
              'en-GB': 'Semi-skimmed / Skimmed Milk (<b>Milk</b>), Espresso.',
            },
          },
          {
            name: 'description',
            value: {
              'en-GB':
                'Pret’s signature organic espresso combined with silky steamed milk and finished with a light layer of foam. Served as a 12oz drink\r\n\r\nAll our Barista prepared drinks are also available decaffeinated. Both skimmed and semi-skimmed milks are available, as well as milk alternatives',
            },
          },
          {
            name: 'longDescription',
            value: {
              'en-GB':
                'Pret’s signature organic espresso combined with silky steamed milk and finished with a light layer of foam. Served as a 12oz drink\r\n\r\nAll our Barista prepared drinks are also available decaffeinated. Both skimmed and semi-skimmed milks are available, as well as milk alternatives',
            },
          },
          {
            name: 'suitableForVegetarians',
            value: true,
          },
          {
            name: 'suitableForVegans',
            value: false,
          },
          {
            name: 'containsAllergens',
            value: ['Milk'],
          },
          {
            name: 'localizedContainsAllergens',
            value: [
              {
                key: 'Milk',
                label: {
                  'en-GB': 'Milk',
                  en: 'Milk',
                  'zh-HK': '奶類',
                  'fr-FR': 'Lait',
                  'en-US': 'Milk',
                },
              },
            ],
          },
          {
            name: 'visible',
            value: true,
          },
          {
            name: 'country',
            value: {
              key: 'UK',
              label: 'United Kingdom',
            },
          },
          {
            name: 'posId',
            value: '8266780',
          },
          {
            name: 'availableForCollection',
            value: true,
          },
          {
            name: 'averageWeight',
            value: 330.0,
          },
          {
            name: 'sourceSystemLastUpdated',
            value: '2021-09-09T13:26:59.000Z',
          },
          {
            name: 'newUntil',
            value: '2020-09-08',
          },
          {
            name: 'canHaveVariants',
            value: true,
          },
          {
            name: 'requiresBlender',
            value: false,
          },
          {
            name: 'canBeDecaf',
            value: true,
          },
          {
            name: 'requiresIceMachine',
            value: false,
          },
          {
            name: 'canAddSyrup',
            value: true,
          },
          {
            name: 'canAddExtraShot',
            value: true,
          },
          {
            name: 'canAddWhippedCream',
            value: false,
          },
          {
            name: 'canBeBlack',
            value: false,
          },
          {
            name: 'milkCanBeSemiSkimmed',
            value: true,
          },
          {
            name: 'milkCanBeSkimmed',
            value: true,
          },
          {
            name: 'milkCanBeOat',
            value: true,
          },
          {
            name: 'milkCanBeRiceCoconut',
            value: true,
          },
          {
            name: 'milkCanBeSoya',
            value: true,
          },
          {
            name: 'isDecaf',
            value: false,
          },
          {
            name: 'isDecafPod',
            value: false,
          },
          {
            name: 'milkIsSemiSkimmed',
            value: true,
          },
          {
            name: 'milkIsSkimmed',
            value: false,
          },
          {
            name: 'milkIsOat',
            value: false,
          },
          {
            name: 'milkIsRiceCoconut',
            value: false,
          },
          {
            name: 'milkIsSoya',
            value: false,
          },
          {
            name: 'isBlack',
            value: false,
          },
          {
            name: 'variantName',
            value: {
              'en-GB': 'Latte',
            },
          },
          {
            name: 'availableForOutposts',
            value: false,
          },
          {
            name: 'externalTaxCode',
            value: 'PF051906',
          },
          {
            name: 'availableForPretDelivers',
            value: true,
          },
          {
            name: 'pretDeliversAvailableAllDay',
            value: true,
          },
          {
            name: 'pluReportingName',
            value: 'Coffee - 12oz Latte',
          },
          {
            name: 'pluPrimaryCategory',
            value: {
              key: 'HotDrinks',
              label: 'HOT DRINKS',
            },
          },
          {
            name: 'pluSecondaryCategory',
            value: {
              key: 'Coffee',
              label: 'COFFEE',
            },
          },
          {
            name: 'productCategory',
            value: {
              key: 'HotDrinks',
              label: 'HOT DRINKS',
            },
          },
          {
            name: 'productSubCategory',
            value: {
              key: 'HotDrinks',
              label: 'HOT DRINKS',
            },
          },
          {
            name: 'visibleOnDeliveryWebsite',
            value: true,
          },
          {
            name: 'liveFrom',
            value: '2017-12-29',
          },
          {
            name: 'chefSpecial',
            value: false,
          },
          {
            name: 'displayAsNew',
            value: false,
          },
          {
            name: 'hgCode',
            value: 'FP00001148',
          },
          {
            name: 'howToDisplay',
            value: [
              {
                key: 'NA',
                label: 'N/A',
              },
            ],
          },
          {
            name: 'toppings',
            value: [],
          },
          {
            name: 'extras',
            value: ['UK006648'],
          },
          {
            name: 'syrups',
            value: ['UK003991', 'UK003990', 'UK003989', 'UK007293', 'UK008278', 'UK008308'],
          },
        ],
        assets: [],
      },
      searchKeywords: {},
    },
    published: true,
    hasStagedChanges: true,
  },
  key: 'UK006780',
  taxCategory: {
    typeId: 'tax-category',
    id: 'eb5c0e89-411c-49d7-a455-0ad6bcb8ed6b',
  },
  lastVariantId: 15,
} as any as Product
