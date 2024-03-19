export const variantVersionSchema = {
  type: 'object',
  properties: {
    variant: {
      type: 'object',
      properties: {
        starKisProductCategoryID: {
          type: ['string', 'null'],
        },
        pluReportingName: {
          type: ['string', 'null'],
        },
        starKisProductSubCategoryID: {
          type: ['string', 'null'],
        },
        pluPrimaryCategoryID: {
          type: ['string', 'null'],
        },
        pluSecondaryCategoryID: {
          type: ['string', 'null'],
        },
        posID: {
          type: ['string', 'null'],
        },
        productRange: {
          type: ['array', 'null'],
          items: {
            type: 'string',
          },
        },
        howToDisplay: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        prices: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              channelName: {
                type: 'string',
              },
              channelLabel: {
                type: 'object',
                properties: {
                  'en-GB': {
                    type: 'string',
                  },
                  'en-US': {
                    type: 'string',
                  },
                  'fr-FR': {
                    type: 'string',
                  },
                  'en-HK': {
                    type: 'string',
                  },
                  'zh-HK': {
                    type: 'string',
                  },
                },
                required: ['en-GB', 'en-US', 'fr-FR', 'en-HK', 'zh-HK'],
              },
              eatInPrice: {
                type: 'object',
                properties: {
                  centAmount: {
                    type: 'integer',
                  },
                },
                required: ['centAmount'],
              },
              eatInClubPret: {
                type: 'object',
                properties: {
                  centAmount: {
                    type: 'integer',
                  },
                },
                required: ['centAmount'],
              },
              eatInTax: {
                type: 'number',
              },
              takeAwayPrice: {
                type: 'object',
                properties: {
                  centAmount: {
                    type: 'integer',
                  },
                },
                required: ['centAmount'],
              },
              takeAwayClubPret: {
                type: 'object',
                properties: {
                  centAmount: {
                    type: 'integer',
                  },
                },
                required: ['centAmount'],
              },
              deliveryPrice: {
                type: 'object',
                properties: {
                  centAmount: {
                    type: 'integer',
                  },
                },
                required: ['centAmount'],
              },
              deliveryTax: {
                type: 'number',
              },
            },
            required: [
              'channelName',
              'channelLabel',
              'eatInPrice',
              'eatInClubPret',
              'eatInTax',
              'takeAwayPrice',
              'takeAwayClubPret',
              'deliveryPrice',
              'deliveryTax',
            ],
          },
        },
        sku: {
          type: 'string',
        },
        status: {
          type: 'string',
        },
        hamiltonGrant: {
          type: 'object',
          properties: {
            productCode: {
              type: 'string',
            },
            lastSyncedAt: {
              type: ['string', 'null'],
            },
            cuisine: {
              type: 'object',
              properties: {
                isVegan: {
                  type: 'boolean',
                },
                isVegetarian: {
                  type: 'boolean',
                },
              },
              required: ['isVegan', 'isVegetarian'],
            },
            nutrition: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                  },
                  per100g: {
                    type: 'number',
                  },
                  perServing: {
                    type: 'number',
                  },
                  localisedLabel: {
                    type: 'object',
                    properties: {
                      'en-GB': {
                        type: 'string',
                      },
                      'en-US': {
                        type: 'string',
                      },
                      'fr-FR': {
                        type: 'string',
                      },
                      'en-HK': {
                        type: 'string',
                      },
                      'zh-HK': {
                        type: 'string',
                      },
                    },
                    required: ['en-GB', 'en-US', 'fr-FR', 'en-HK', 'zh-HK'],
                  },
                },
                required: ['name', 'per100g', 'perServing', 'localisedLabel'],
              },
            },
            allergens: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  label: {
                    type: 'object',
                    properties: {
                      'en-GB': {
                        type: 'string',
                      },
                      'en-US': {
                        type: 'string',
                      },
                      'fr-FR': {
                        type: 'string',
                      },
                      'en-HK': {
                        type: 'string',
                      },
                      'zh-HK': {
                        type: 'string',
                      },
                    },
                    required: ['en-GB', 'en-US', 'fr-FR', 'en-HK', 'zh-HK'],
                  },
                  name: {
                    type: 'string',
                  },
                },
                required: ['label', 'name'],
              },
            },
            ingredients: {
              type: 'object',
              properties: {
                'en-GB': {
                  type: 'string',
                },
                'en-US': {
                  type: 'string',
                },
                'fr-FR': {
                  type: 'string',
                },
                'en-HK': {
                  type: 'string',
                },
                'zh-HK': {
                  type: 'string',
                },
              },
              required: ['en-GB', 'en-US', 'fr-FR', 'en-HK', 'zh-HK'],
            },
          },
          required: [
            'productCode',
            'lastSyncedAt',
            'cuisine',
            'nutrition',
            'allergens',
            'ingredients',
          ],
        },
        description: {
          type: 'object',
          properties: {
            standard: {
              type: 'object',
              properties: {
                'en-GB': {
                  type: 'string',
                },
                'en-US': {
                  type: 'string',
                },
                'fr-FR': {
                  type: 'string',
                },
                'en-HK': {
                  type: 'string',
                },
                'zh-HK': {
                  type: 'string',
                },
              },
              required: ['en-GB', 'en-US', 'fr-FR', 'en-HK', 'zh-HK'],
            },
          },
          required: ['standard'],
        },
        name: {
          type: 'object',
          properties: {
            'en-GB': {
              type: 'string',
            },
            'en-US': {
              type: 'string',
            },
            'fr-FR': {
              type: 'string',
            },
            'en-HK': {
              type: 'string',
            },
            'zh-HK': {
              type: 'string',
            },
          },
          required: ['en-GB', 'en-US', 'fr-FR', 'en-HK', 'zh-HK'],
        },
        image: {
          type: ['string', 'null'],
        },
        availability: {
          type: 'object',
          properties: {
            isLive: {
              type: 'boolean',
            },
            visibleOnDeliveryWebsite: {
              type: 'boolean',
            },
            availableForPretDelivers: {
              type: 'boolean',
            },
            availableForClickAndCollect: {
              type: 'boolean',
            },
            availableForOutposts: {
              type: 'boolean',
            },
            isChefsSpecial: {
              type: 'boolean',
            },
            displayAsNew: {
              type: 'object',
              properties: {
                isDisplayed: {
                  type: 'boolean',
                },
                until: {
                  type: ['string', 'null'],
                },
              },
              required: ['isDisplayed', 'until'],
            },
            liveSchedule: {
              type: 'object',
              properties: {
                on: {
                  type: ['string', 'null'],
                },
                off: {
                  type: ['string', 'null'],
                },
              },
              required: ['on', 'off'],
            },
            availableForLunch: {
              type: 'boolean',
            },
            availableAllDay: {
              type: 'boolean',
            },
          },
          required: [
            'isLive',
            'visibleOnDeliveryWebsite',
            'availableForPretDelivers',
            'availableForClickAndCollect',
            'availableForOutposts',
            'isChefsSpecial',
            'displayAsNew',
            'liveSchedule',
            'availableForLunch',
            'availableAllDay',
          ],
        },
        isMaster: {
          type: 'boolean',
        },
        size: {
          type: ['string', 'null'],
        },
        attributes: {
          type: ['object', 'null'],
          properties: {
            withDecafPods: {
              type: 'boolean',
            },
            withOatMilk: {
              type: 'boolean',
            },
            withoutMilk: {
              type: 'boolean',
            },
            withRiceCoconutMilk: {
              type: 'boolean',
            },
            withSemiSkimmedMilk: {
              type: 'boolean',
            },
            withSkimmedMilk: {
              type: 'boolean',
            },
            withSoyMilk: {
              type: 'boolean',
            },
          },
          required: [
            'withDecafPods',
            'withOatMilk',
            'withoutMilk',
            'withRiceCoconutMilk',
            'withSemiSkimmedMilk',
            'withSkimmedMilk',
            'withSoyMilk',
          ],
        },
        versions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
              },
              liveFrom: {
                type: 'string',
              },
              name: {
                type: 'object',
                properties: {
                  'en-GB': {
                    type: 'string',
                  },
                  'en-US': {
                    type: 'string',
                  },
                  'fr-FR': {
                    type: 'string',
                  },
                  'en-HK': {
                    type: 'string',
                  },
                  'zh-HK': {
                    type: 'string',
                  },
                },
                required: ['en-GB', 'en-US', 'fr-FR', 'en-HK', 'zh-HK'],
              },
              version: {
                type: 'integer',
              },
              key: {
                type: 'string',
              },
              sku: {
                type: 'string',
              },
              hgCode: {
                type: 'string',
              },
              publishState: {
                type: 'string',
              },
            },
            required: ['id', 'liveFrom', 'name', 'version', 'key', 'sku', 'hgCode', 'publishState'],
          },
        },
        labelling: {
          type: 'object',
          properties: {
            storageConditions: {
              type: ['null', 'string'],
            },
            useBy: {
              type: ['null', 'string'],
            },
            sellBy: {
              type: ['null', 'string'],
            },
            ean13Code: {
              type: ['null', 'string'],
            },
            countryOfOriginDescription: {
              type: ['null', 'string'],
            },
            includeAverageWeightOnLabel: {
              type: 'boolean',
            },
            legalTitle: {
              type: ['null', 'string'],
            },
            howToCard: {
              type: 'object',
              properties: {
                fileName: {
                  type: 'string',
                },
                qrPng: {
                  type: 'string',
                },
                qrSvg: {
                  type: 'string',
                },
              },
              required: ['fileName', 'qrPng', 'qrSvg'],
            },
            includeNutritionalInformationOnLabel: {
              type: 'boolean',
            },
          },
          required: [
            'storageConditions',
            'useBy',
            'sellBy',
            'ean13Code',
            'countryOfOriginDescription',
            'includeAverageWeightOnLabel',
            'legalTitle',
            'howToCard',
            'includeNutritionalInformationOnLabel',
          ],
        },
        parentProductSku: {
          type: ['null', 'string'],
        },
      },
      required: [
        'starKisProductCategoryID',
        'pluReportingName',
        'starKisProductSubCategoryID',
        'pluPrimaryCategoryID',
        'pluSecondaryCategoryID',
        'posID',
        'productRange',
        'howToDisplay',
        'prices',
        'sku',
        'status',
        'hamiltonGrant',
        'description',
        'name',
        'image',
        'availability',
        'isMaster',
        'size',
        'attributes',
        'versions',
        'labelling',
        'parentProductSku',
      ],
    },
    draft: {
      type: 'object',
      properties: {
        starKisProductCategoryID: {
          type: 'string',
        },
        pluReportingName: {
          type: 'string',
        },
        starKisProductSubCategoryID: {
          type: 'string',
        },
        pluPrimaryCategoryID: {
          type: 'string',
        },
        pluSecondaryCategoryID: {
          type: 'string',
        },
        posID: {
          type: 'null',
        },
        productRange: {
          type: ['array', 'null'],
          items: {
            type: 'string',
          },
        },
        howToDisplay: {
          type: 'array',
          items: {},
        },
        prices: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              channelName: {
                type: 'string',
              },
              channelLabel: {
                type: 'object',
                properties: {
                  'en-GB': {
                    type: 'string',
                  },
                  'en-US': {
                    type: 'string',
                  },
                  'fr-FR': {
                    type: 'string',
                  },
                  'en-HK': {
                    type: 'string',
                  },
                  'zh-HK': {
                    type: 'string',
                  },
                },
                required: ['en-GB', 'en-US', 'fr-FR', 'en-HK', 'zh-HK'],
              },
              eatInPrice: {
                type: 'object',
                properties: {
                  centAmount: {
                    type: 'integer',
                  },
                },
                required: ['centAmount'],
              },
              eatInClubPret: {
                type: 'object',
                properties: {
                  centAmount: {
                    type: 'integer',
                  },
                },
                required: ['centAmount'],
              },
              eatInTax: {
                type: 'number',
              },
              takeAwayPrice: {
                type: 'object',
                properties: {
                  centAmount: {
                    type: 'integer',
                  },
                },
                required: ['centAmount'],
              },
              takeAwayClubPret: {
                type: 'object',
                properties: {
                  centAmount: {
                    type: 'integer',
                  },
                },
                required: ['centAmount'],
              },
              deliveryPrice: {
                type: 'object',
                properties: {
                  centAmount: {
                    type: 'integer',
                  },
                },
                required: ['centAmount'],
              },
              deliveryTax: {
                type: 'number',
              },
            },
            required: [
              'channelName',
              'channelLabel',
              'eatInPrice',
              'eatInClubPret',
              'eatInTax',
              'takeAwayPrice',
              'takeAwayClubPret',
              'deliveryPrice',
              'deliveryTax',
            ],
          },
        },
        sku: {
          type: 'string',
        },
        status: {
          type: 'string',
        },
        hamiltonGrant: {
          type: 'object',
          properties: {
            productCode: {
              type: 'string',
            },
            lastSyncedAt: {
              type: 'string',
            },
            cuisine: {
              type: 'object',
              properties: {
                isVegan: {
                  type: 'boolean',
                },
                isVegetarian: {
                  type: 'boolean',
                },
              },
              required: ['isVegan', 'isVegetarian'],
            },
            nutrition: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                  },
                  per100g: {
                    type: ['null', 'number'],
                  },
                  perServing: {
                    type: ['null', 'number'],
                  },
                  localisedLabel: {
                    type: 'object',
                    properties: {
                      'en-GB': {
                        type: 'string',
                      },
                      'en-US': {
                        type: 'string',
                      },
                      'fr-FR': {
                        type: 'string',
                      },
                      'en-HK': {
                        type: 'string',
                      },
                      'zh-HK': {
                        type: 'string',
                      },
                    },
                    required: ['en-GB', 'en-US', 'fr-FR', 'en-HK', 'zh-HK'],
                  },
                },
                required: ['name', 'per100g', 'perServing', 'localisedLabel'],
              },
            },
            allergens: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  label: {
                    type: 'object',
                    properties: {
                      'en-GB': {
                        type: 'string',
                      },
                      'en-US': {
                        type: 'string',
                      },
                      'fr-FR': {
                        type: 'string',
                      },
                      'en-HK': {
                        type: 'string',
                      },
                      'zh-HK': {
                        type: 'string',
                      },
                    },
                    required: ['en-GB', 'en-US', 'fr-FR', 'en-HK', 'zh-HK'],
                  },
                  name: {
                    type: 'string',
                  },
                },
                required: ['label', 'name'],
              },
            },
            ingredients: {
              type: 'object',
              properties: {
                'en-GB': {
                  type: 'string',
                },
                'en-US': {
                  type: 'string',
                },
                'fr-FR': {
                  type: 'string',
                },
                'en-HK': {
                  type: 'string',
                },
                'zh-HK': {
                  type: 'string',
                },
              },
              required: ['en-GB', 'en-US', 'fr-FR', 'en-HK', 'zh-HK'],
            },
          },
          required: [
            'productCode',
            'lastSyncedAt',
            'cuisine',
            'nutrition',
            'allergens',
            'ingredients',
          ],
        },
        description: {
          type: 'object',
          properties: {
            standard: {
              type: 'object',
              properties: {
                'en-GB': {
                  type: 'string',
                },
                'en-US': {
                  type: 'string',
                },
                'fr-FR': {
                  type: 'string',
                },
                'en-HK': {
                  type: 'string',
                },
                'zh-HK': {
                  type: 'string',
                },
              },
              required: ['en-GB', 'en-US', 'fr-FR', 'en-HK', 'zh-HK'],
            },
          },
          required: ['standard'],
        },
        name: {
          type: 'object',
          properties: {
            'en-GB': {
              type: 'string',
            },
            'en-US': {
              type: 'string',
            },
            'fr-FR': {
              type: 'string',
            },
            'en-HK': {
              type: 'string',
            },
            'zh-HK': {
              type: 'string',
            },
          },
          required: ['en-GB', 'en-US', 'fr-FR', 'en-HK', 'zh-HK'],
        },
        image: {
          type: ['null', 'string'],
        },
        availability: {
          type: 'object',
          properties: {
            isLive: {
              type: 'boolean',
            },
            visibleOnDeliveryWebsite: {
              type: 'boolean',
            },
            availableForPretDelivers: {
              type: 'boolean',
            },
            availableForClickAndCollect: {
              type: 'boolean',
            },
            availableForOutposts: {
              type: 'boolean',
            },
            isChefsSpecial: {
              type: 'boolean',
            },
            displayAsNew: {
              type: 'object',
              properties: {
                isDisplayed: {
                  type: 'boolean',
                },
                until: {
                  type: ['null', 'string'],
                },
              },
              required: ['isDisplayed', 'until'],
            },
            liveSchedule: {
              type: 'object',
              properties: {
                on: {
                  type: ['null', 'string'],
                },
                off: {
                  type: ['null', 'string'],
                },
              },
              required: ['on', 'off'],
            },
            availableForLunch: {
              type: 'boolean',
            },
            availableAllDay: {
              type: 'boolean',
            },
          },
          required: [
            'isLive',
            'visibleOnDeliveryWebsite',
            'availableForPretDelivers',
            'availableForClickAndCollect',
            'availableForOutposts',
            'isChefsSpecial',
            'displayAsNew',
            'liveSchedule',
            'availableForLunch',
            'availableAllDay',
          ],
        },
        isMaster: {
          type: 'boolean',
        },
        size: {
          type: 'string',
        },
        attributes: {
          type: ['object', 'null'],
          properties: {
            withDecafPods: {
              type: 'boolean',
            },
            withOatMilk: {
              type: 'boolean',
            },
            withoutMilk: {
              type: 'boolean',
            },
            withRiceCoconutMilk: {
              type: 'boolean',
            },
            withSemiSkimmedMilk: {
              type: 'boolean',
            },
            withSkimmedMilk: {
              type: 'boolean',
            },
            withSoyMilk: {
              type: 'boolean',
            },
          },
          required: [
            'withDecafPods',
            'withOatMilk',
            'withoutMilk',
            'withRiceCoconutMilk',
            'withSemiSkimmedMilk',
            'withSkimmedMilk',
            'withSoyMilk',
          ],
        },
        versions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
              },
              liveFrom: {
                type: 'string',
              },
              name: {
                type: 'object',
                properties: {
                  'en-GB': {
                    type: 'string',
                  },
                  'en-US': {
                    type: 'string',
                  },
                  'fr-FR': {
                    type: 'string',
                  },
                  'en-HK': {
                    type: 'string',
                  },
                  'zh-HK': {
                    type: 'string',
                  },
                },
                required: ['en-GB', 'en-US', 'fr-FR', 'en-HK', 'zh-HK'],
              },
              version: {
                type: 'integer',
              },
              key: {
                type: 'string',
              },
              sku: {
                type: 'string',
              },
              hgCode: {
                type: 'string',
              },
              publishState: {
                type: 'string',
              },
            },
            required: ['id', 'liveFrom', 'name', 'version', 'key', 'sku', 'hgCode', 'publishState'],
          },
        },
        labelling: {
          type: 'object',
          properties: {
            storageConditions: {
              type: ['null', 'string'],
            },
            useBy: {
              type: ['null', 'string'],
            },
            sellBy: {
              type: ['null', 'string'],
            },
            ean13Code: {
              type: ['null', 'string'],
            },
            countryOfOriginDescription: {
              type: ['null', 'string'],
            },
            includeAverageWeightOnLabel: {
              type: 'boolean',
            },
            legalTitle: {
              type: ['null', 'string'],
            },
            howToCard: {
              type: 'object',
              properties: {
                fileName: {
                  type: 'string',
                },
                qrPng: {
                  type: 'string',
                },
                qrSvg: {
                  type: 'string',
                },
              },
              required: ['fileName', 'qrPng', 'qrSvg'],
            },
            includeNutritionalInformationOnLabel: {
              type: 'boolean',
            },
          },
          required: [
            'storageConditions',
            'useBy',
            'sellBy',
            'ean13Code',
            'countryOfOriginDescription',
            'includeAverageWeightOnLabel',
            'legalTitle',
            'howToCard',
            'includeNutritionalInformationOnLabel',
          ],
        },
        parentProductSku: {
          type: ['null', 'string'],
        },
        changesCount: {
          type: 'object',
          properties: {
            marketing: {
              type: 'integer',
            },
            reporting: {
              type: 'integer',
            },
            attributes: {
              type: 'integer',
            },
            total: {
              type: 'integer',
            },
            pricing: {
              type: 'integer',
            },
            labelling: {
              type: 'integer',
            },
          },
          required: ['marketing', 'reporting', 'attributes', 'total', 'pricing', 'labelling'],
        },
      },
      required: [
        'starKisProductCategoryID',
        'pluReportingName',
        'starKisProductSubCategoryID',
        'pluPrimaryCategoryID',
        'pluSecondaryCategoryID',
        'posID',
        'productRange',
        'howToDisplay',
        'prices',
        'sku',
        'status',
        'hamiltonGrant',
        'description',
        'name',
        'image',
        'availability',
        'isMaster',
        'size',
        'attributes',
        'versions',
        'labelling',
        'parentProductSku',
        'changesCount',
      ],
    },
    variantVersion: {
      type: 'integer',
    },
    id: {
      type: 'string',
    },
    publishState: {
      type: 'string',
    },
    key: {
      type: 'string',
    },
    approvedTabs: {
      type: 'object',
      properties: {
        marketing: {
          type: 'boolean',
        },
        labelling: {
          type: 'boolean',
        },
        pricing: {
          type: 'boolean',
        },
        reporting: {
          type: 'boolean',
        },
      },
      required: ['marketing', 'labelling', 'pricing', 'reporting'],
    },
    draftTabs: {
      type: 'object',
      properties: {
        marketing: {
          type: 'boolean',
        },
        labelling: {
          type: 'boolean',
        },
        pricing: {
          type: 'boolean',
        },
        reporting: {
          type: 'boolean',
        },
      },
      required: ['marketing', 'labelling', 'pricing', 'reporting'],
    },
  },
  required: [
    'variant',
    'draft',
    'variantVersion',
    'id',
    'publishState',
    'key',
    'approvedTabs',
    'draftTabs',
  ],
}
