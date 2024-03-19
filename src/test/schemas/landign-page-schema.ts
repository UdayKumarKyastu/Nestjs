const optionalString = {
  type: ['string', 'null'],
}

export const landingSchema = {
  type: 'object',
  properties: {
    productGroups: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          changesCount: {
            type: 'integer',
          },
          countryCode: {
            type: 'string',
          },
          sku: {
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
          variants: {
            type: 'array',
            items: {
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
                countryCode: {
                  type: 'string',
                },
                changesCount: {
                  type: 'integer',
                },
                sku: {
                  type: 'string',
                },
                isMaster: {
                  type: 'boolean',
                },
                recipeID: optionalString,
                createdAt: optionalString,
                liveFrom: optionalString,
                liveTo: optionalString,
                versions: {
                  type: 'array',
                  items: {
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
                      sku: {
                        type: 'string',
                      },
                      isMaster: {
                        type: 'boolean',
                      },
                      recipeID: optionalString,
                      countryCode: {
                        type: 'string',
                      },
                      changesCount: {
                        type: 'integer',
                      },
                      versionNumber: {
                        type: 'integer',
                      },
                      createdAt: optionalString,
                      liveFrom: optionalString,
                      liveTo: optionalString,
                    },
                    required: [
                      'name',
                      'sku',
                      'isMaster',
                      'recipeID',
                      'countryCode',
                      'versionNumber',
                    ],
                  },
                },
              },
              required: ['name', 'countryCode', 'sku', 'isMaster', 'recipeID', 'versions'],
            },
          },
        },
        required: ['countryCode', 'sku', 'name', 'variants'],
      },
    },
  },
  required: ['productGroups'],
}
