export const searchResponseSchema = {
  type: 'object',
  properties: {
    products: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          countryCode: {
            type: 'string',
          },
          createdAt: {
            type: 'string',
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
          published: {
            type: 'boolean',
          },
          sku: {
            type: 'string',
          },
          variants: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                countryCode: {
                  type: 'string',
                },
                createdAt: {
                  type: 'string',
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
                hgCode: {
                  type: ['null', 'string'],
                },
                imageUrl: {
                  type: ['null', 'string'],
                },
                isMaster: {
                  type: 'boolean',
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
                published: {
                  type: 'boolean',
                },
                sku: {
                  type: 'string',
                },
                visibleOnWebsiteVariants: {
                  type: 'boolean',
                },
              },
              required: [
                'countryCode',
                'createdAt',
                'description',
                'hgCode',
                'imageUrl',
                'isMaster',
                'name',
                'published',
                'sku',
                'visibleOnWebsite',
              ],
            },
          },
          visibleOnWebsiteVariants: {
            type: 'integer',
          },
        },
        required: [
          'countryCode',
          'createdAt',
          'published',
          'visibleOnWebsiteVariants',
          'sku',
          'name',
          'description',
          'variants',
        ],
      },
    },
    total: {
      type: 'integer',
    },
  },
  required: ['products', 'total'],
}
