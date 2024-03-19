export const productResponseSchema = {
  type: 'object',
  properties: {
    product: {
      type: 'object',
      properties: {
        type: {
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
        description: {
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
        country: {
          type: 'string',
        },
        countryCode: {
          type: 'string',
        },
        categories: {
          type: 'array',
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                },
                key: {
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
              },
              required: ['id', 'key', 'name'],
            },
          },
        },
        taxCategory: {
          type: ['object', 'null'],
          properties: {
            id: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
          },
          required: ['id', 'name'],
        },
        variants: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
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
                        currencyCode: {
                          type: 'string',
                        },
                        centAmount: {
                          type: 'integer',
                        },
                      },
                      required: ['currencyCode', 'centAmount'],
                    },
                    eatInTax: {
                      type: 'number',
                    },
                    takeAwayPrice: {
                      type: 'object',
                      properties: {
                        currencyCode: {
                          type: 'string',
                        },
                        centAmount: {
                          type: 'integer',
                        },
                      },
                      required: ['currencyCode', 'centAmount'],
                    },
                    takeAwayClubPret: {
                      type: 'object',
                      properties: {
                        currencyCode: {
                          type: 'string',
                        },
                        centAmount: {
                          type: 'integer',
                        },
                      },
                      required: ['currencyCode', 'centAmount'],
                    },
                    eatInClubPret: {
                      type: 'object',
                      properties: {
                        currencyCode: {
                          type: 'string',
                        },
                        centAmount: {
                          type: 'integer',
                        },
                      },
                      required: ['currencyCode', 'centAmount'],
                    },
                    deliveryPrice: {
                      type: 'object',
                      properties: {
                        currencyCode: {
                          type: 'string',
                        },
                        centAmount: {
                          type: 'integer',
                        },
                      },
                      required: ['currencyCode', 'centAmount'],
                    },
                    deliveryTax: {
                      type: 'number',
                    },
                  },
                  required: [
                    'channelName',
                    'channelLabel',
                    'eatInPrice',
                    'eatInTax',
                    'eatInClubPret',
                    'takeAwayPrice',
                    'takeAwayClubPret',
                    'deliveryPrice',
                    'deliveryTax',
                  ],
                },
              },
              image: {
                type: ['object', 'null'],
                properties: {
                  default: {
                    type: 'string',
                  },
                  thumbnail: {
                    type: 'string',
                  },
                },
                required: ['default', 'thumbnail'],
              },
              versions: {
                type: 'array',
                items: {},
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
              hamiltonGrant: {
                type: 'object',
                properties: {
                  lastSyncedAt: {
                    type: ['string', 'null'],
                  },
                  cuisine: {
                    type: 'object',
                    properties: {
                      isVegetarian: {
                        type: 'boolean',
                      },
                      isVegan: {
                        type: 'boolean',
                      },
                    },
                    required: ['isVegetarian', 'isVegan'],
                  },
                  productCode: {
                    type: ['string', 'null'],
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
                  allergens: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                        },
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
                      },
                      required: ['name', 'label'],
                    },
                  },
                  nutrition: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        per100g: {
                          type: ['number', 'null'],
                        },
                        perServing: {
                          type: ['number', 'null'],
                        },
                        name: {
                          type: 'string',
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
                      required: ['per100g', 'perServing', 'name', 'localisedLabel'],
                    },
                  },
                },
                required: [
                  'lastSyncedAt',
                  'cuisine',
                  'productCode',
                  'ingredients',
                  'allergens',
                  'nutrition',
                ],
              },
              availability: {
                type: 'object',
                properties: {
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
                  availableAllDay: {
                    type: 'boolean',
                  },
                  availableForLunch: {
                    type: 'boolean',
                  },
                  availableForOutposts: {
                    type: 'boolean',
                  },
                  isLive: {
                    type: 'boolean',
                  },
                  isChefsSpecial: {
                    type: 'boolean',
                  },
                  availableForClickAndCollect: {
                    type: 'boolean',
                  },
                  availableForPretDelivers: {
                    type: 'boolean',
                  },
                  visibleOnDeliveryWebsite: {
                    type: 'boolean',
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
                },
                required: [
                  'displayAsNew',
                  'availableAllDay',
                  'availableForLunch',
                  'availableForOutposts',
                  'isLive',
                  'isChefsSpecial',
                  'availableForClickAndCollect',
                  'availableForPretDelivers',
                  'visibleOnDeliveryWebsite',
                  'liveSchedule',
                ],
              },
              pluReportingName: {
                type: ['string', 'null'],
              },
              pluPrimaryCategoryID: {
                type: ['string', 'null'],
              },
              starKisProductCategoryID: {
                type: ['string', 'null'],
              },
              pluSecondaryCategoryID: {
                type: ['string', 'null'],
              },
              starKisProductSubCategoryID: {
                type: ['string', 'null'],
              },
              posID: {
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
              sku: {
                type: 'string',
              },
              howToDisplay: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              size: {
                type: ['string', 'number'],
              },
              isMaster: {
                type: 'boolean',
              },
              status: {
                type: 'string',
              },
              parentProductSku: {
                type: ['string', 'null'],
              },
              labelling: {
                type: ['object', 'null'],
                properties: {
                  includeNutritionalInformationOnLabel: {
                    type: 'boolean',
                  },
                  useBy: {
                    type: ['string', 'null'],
                  },
                  sellBy: {
                    type: ['string', 'null'],
                  },
                  useByTurboChef: {
                    type: ['string', 'null'],
                  },
                  sellByTurboChef: {
                    type: ['string', 'null'],
                  },
                  storageConditions: {
                    type: ['string', 'null'],
                  },
                  countryOfOriginDescription: {
                    type: ['string', 'null'],
                  },
                  ean13Code: {
                    type: ['string', 'null'],
                  },
                  legalTitle: {
                    type: ['string', 'null'],
                  },
                  includeAverageWeightOnLabel: {
                    type: 'boolean',
                  },
                  canBeCookedInTurboChef: {
                    type: 'boolean',
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
                },
              },
            },
            required: [
              'description',
              'prices',
              'image',
              'versions',
              'name',
              'hamiltonGrant',
              'availability',
              'pluReportingName',
              'pluPrimaryCategoryID',
              'starKisProductCategoryID',
              'pluSecondaryCategoryID',
              'starKisProductSubCategoryID',
              'posID',
              'attributes',
              'sku',
              'howToDisplay',
              'size',
              'isMaster',
              'status',
              'parentProductSku',
              'labelling',
            ],
          },
        },
        setUp: {
          type: ['object', 'null'],
          properties: {
            canHaveVariants: {
              type: 'boolean',
            },
            blenderRequired: {
              type: 'boolean',
            },
            canAddExtraCoffeeShot: {
              type: 'boolean',
            },
            canAddSyrup: {
              type: 'boolean',
            },
            canAddWhippedCream: {
              type: 'boolean',
            },
            canBeDecaf: {
              type: 'boolean',
            },
            canBeWithOatMilk: {
              type: 'boolean',
            },
            canBeWithoutMilk: {
              type: 'boolean',
            },
            canBeWithRiceCoconutMilk: {
              type: 'boolean',
            },
            canBeWithSemiSkimmedMilk: {
              type: 'boolean',
            },
            canBeWithSkimmedMilk: {
              type: 'boolean',
            },
            canBeWithSoyMilk: {
              type: 'boolean',
            },
            iceMachineRequired: {
              type: 'boolean',
            },
          },
          required: [
            'canHaveVariants',
            'blenderRequired',
            'canAddExtraCoffeeShot',
            'canAddSyrup',
            'canAddWhippedCream',
            'canBeDecaf',
            'canBeWithOatMilk',
            'canBeWithoutMilk',
            'canBeWithRiceCoconutMilk',
            'canBeWithSemiSkimmedMilk',
            'canBeWithSkimmedMilk',
            'canBeWithSoyMilk',
            'iceMachineRequired',
          ],
        },
        published: {
          type: 'boolean',
        },
        createdAt: {
          type: ['string', 'null'],
        },
      },
      required: [
        'type',
        'name',
        'description',
        'country',
        'countryCode',
        'categories',
        'taxCategory',
        'variants',
        'setUp',
        'published',
        'createdAt',
      ],
    },
    taxCategories: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
        },
        required: ['id', 'name'],
      },
    },
    draftChanges: {
      type: 'object',
      properties: {
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
        description: {
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
        lastEdit: {
          type: 'string',
        },
        createdAt: {
          type: 'string',
        },
        published: {
          type: 'boolean',
        },
        taxCategory: {
          type: ['object', 'null'],
          properties: {
            id: {
              type: 'string',
            },
          },
          required: ['id'],
        },
        variants: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
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
                        currencyCode: {
                          type: 'string',
                        },
                        centAmount: {
                          type: 'integer',
                        },
                      },
                      required: ['currencyCode', 'centAmount'],
                    },
                    eatInTax: {
                      type: 'number',
                    },
                    takeAwayPrice: {
                      type: 'object',
                      properties: {
                        currencyCode: {
                          type: 'string',
                        },
                        centAmount: {
                          type: 'integer',
                        },
                      },
                      required: ['currencyCode', 'centAmount'],
                    },
                    eatInClubPret: {
                      type: 'object',
                      properties: {
                        currencyCode: {
                          type: 'string',
                        },
                        centAmount: {
                          type: 'integer',
                        },
                      },
                      required: ['currencyCode', 'centAmount'],
                    },
                    takeAwayClubPret: {
                      type: 'object',
                      properties: {
                        currencyCode: {
                          type: 'string',
                        },
                        centAmount: {
                          type: 'integer',
                        },
                      },
                      required: ['currencyCode', 'centAmount'],
                    },
                    deliveryPrice: {
                      type: 'object',
                      properties: {
                        currencyCode: {
                          type: 'string',
                        },
                        centAmount: {
                          type: 'integer',
                        },
                      },
                      required: ['currencyCode', 'centAmount'],
                    },
                    deliveryTax: {
                      type: 'number',
                    },
                  },
                  required: [
                    'channelName',
                    'channelLabel',
                    'eatInPrice',
                    'eatInTax',
                    'eatInClubPret',
                    'takeAwayPrice',
                    'takeAwayClubPret',
                    'deliveryPrice',
                    'deliveryTax',
                  ],
                },
              },
              image: {
                type: ['object', 'null'],
                properties: {
                  default: {
                    type: 'string',
                  },
                  thumbnail: {
                    type: 'string',
                  },
                },
                required: ['default', 'thumbnail'],
              },
              versions: {
                type: 'array',
                items: {},
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
              hamiltonGrant: {
                type: 'object',
                properties: {
                  lastSyncedAt: {
                    type: ['string', 'null'],
                  },
                  cuisine: {
                    type: 'object',
                    properties: {
                      isVegetarian: {
                        type: 'boolean',
                      },
                      isVegan: {
                        type: 'boolean',
                      },
                    },
                    required: ['isVegetarian', 'isVegan'],
                  },
                  productCode: {
                    type: ['string', 'null'],
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
                  allergens: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                        },
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
                      },
                      required: ['name', 'label'],
                    },
                  },
                  nutrition: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        per100g: {
                          type: ['number', 'null'],
                        },
                        perServing: {
                          type: ['number', 'null'],
                        },
                        name: {
                          type: 'string',
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
                      required: ['per100g', 'perServing', 'name', 'localisedLabel'],
                    },
                  },
                },
                required: [
                  'lastSyncedAt',
                  'cuisine',
                  'productCode',
                  'ingredients',
                  'allergens',
                  'nutrition',
                ],
              },
              availability: {
                type: 'object',
                properties: {
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
                  availableAllDay: {
                    type: 'boolean',
                  },
                  availableForLunch: {
                    type: 'boolean',
                  },
                  availableForOutposts: {
                    type: 'boolean',
                  },
                  isLive: {
                    type: 'boolean',
                  },
                  isChefsSpecial: {
                    type: 'boolean',
                  },
                  availableForClickAndCollect: {
                    type: 'boolean',
                  },
                  availableForPretDelivers: {
                    type: 'boolean',
                  },
                  visibleOnDeliveryWebsite: {
                    type: 'boolean',
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
                },
                required: [
                  'displayAsNew',
                  'availableAllDay',
                  'availableForLunch',
                  'availableForOutposts',
                  'isLive',
                  'isChefsSpecial',
                  'availableForClickAndCollect',
                  'availableForPretDelivers',
                  'visibleOnDeliveryWebsite',
                  'liveSchedule',
                ],
              },
              pluReportingName: {
                type: ['string', 'null'],
              },
              pluPrimaryCategoryID: {
                type: ['string', 'null'],
              },
              starKisProductCategoryID: {
                type: ['string', 'null'],
              },
              pluSecondaryCategoryID: {
                type: ['string', 'null'],
              },
              starKisProductSubCategoryID: {
                type: ['string', 'null'],
              },
              posID: {
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
              sku: {
                type: 'string',
              },
              howToDisplay: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              size: {
                type: 'string',
              },
              isMaster: {
                type: 'boolean',
              },
              status: {
                type: 'string',
              },
              parentProductSku: {
                type: 'null',
              },
              labelling: {
                type: ['object', 'null'],
                properties: {
                  includeNutritionalInformationOnLabel: {
                    type: 'boolean',
                  },
                  useBy: {
                    type: ['string', 'null'],
                  },
                  sellBy: {
                    type: ['string', 'null'],
                  },
                  useByTurboChef: {
                    type: ['string', 'null'],
                  },
                  sellByTurboChef: {
                    type: ['string', 'null'],
                  },
                  storageConditions: {
                    type: ['string', 'null'],
                  },
                  countryOfOriginDescription: {
                    type: ['string', 'null'],
                  },
                  ean13Code: {
                    type: ['string', 'null'],
                  },
                  legalTitle: {
                    type: ['string', 'null'],
                  },
                  includeAverageWeightOnLabel: {
                    type: 'boolean',
                  },
                  canBeCookedInTurboChef: {
                    type: 'boolean',
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
                },
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
                  pricing: {
                    type: 'integer',
                  },
                  labelling: {
                    type: 'integer',
                  },
                  total: {
                    type: 'integer',
                  },
                },
                required: ['marketing', 'reporting', 'attributes', 'pricing', 'labelling', 'total'],
              },
            },
            required: [
              'description',
              'prices',
              'image',
              'versions',
              'name',
              'hamiltonGrant',
              'availability',
              'pluReportingName',
              'pluPrimaryCategoryID',
              'starKisProductCategoryID',
              'pluSecondaryCategoryID',
              'starKisProductSubCategoryID',
              'posID',
              'attributes',
              'sku',
              'howToDisplay',
              'size',
              'isMaster',
              'status',
              'parentProductSku',
              'labelling',
              'changesCount',
            ],
          },
        },
        categories: {
          type: 'array',
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                },
                key: {
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
              },
              required: ['id', 'key', 'name'],
            },
          },
        },
        changesCount: {
          type: 'object',
          properties: {
            marketing: {
              type: 'integer',
            },
            categories: {
              type: 'integer',
            },
            setUp: {
              type: 'integer',
            },
            total: {
              type: 'integer',
            },
          },
          required: ['marketing', 'categories', 'setUp', 'total'],
        },
        setUp: {
          type: ['object', 'null'],
          properties: {
            canHaveVariants: {
              type: 'boolean',
            },
            blenderRequired: {
              type: 'boolean',
            },
            canAddExtraCoffeeShot: {
              type: 'boolean',
            },
            canAddSyrup: {
              type: 'boolean',
            },
            canAddWhippedCream: {
              type: 'boolean',
            },
            canBeDecaf: {
              type: 'boolean',
            },
            canBeWithOatMilk: {
              type: 'boolean',
            },
            canBeWithoutMilk: {
              type: 'boolean',
            },
            canBeWithRiceCoconutMilk: {
              type: 'boolean',
            },
            canBeWithSemiSkimmedMilk: {
              type: 'boolean',
            },
            canBeWithSkimmedMilk: {
              type: 'boolean',
            },
            canBeWithSoyMilk: {
              type: 'boolean',
            },
            iceMachineRequired: {
              type: 'boolean',
            },
          },
          required: [
            'canHaveVariants',
            'blenderRequired',
            'canAddExtraCoffeeShot',
            'canAddSyrup',
            'canAddWhippedCream',
            'canBeDecaf',
            'canBeWithOatMilk',
            'canBeWithoutMilk',
            'canBeWithRiceCoconutMilk',
            'canBeWithSemiSkimmedMilk',
            'canBeWithSkimmedMilk',
            'canBeWithSoyMilk',
            'iceMachineRequired',
          ],
        },
      },
      required: [
        'name',
        'description',
        'lastEdit',
        'createdAt',
        'published',
        'taxCategory',
        'variants',
        'categories',
        'changesCount',
        'setUp',
      ],
    },
    version: {
      type: 'integer',
    },
  },
  required: ['product', 'taxCategories', 'draftChanges', 'version'],
}
