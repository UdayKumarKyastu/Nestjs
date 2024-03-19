export const reportingSchema = {
  type: 'object',
  properties: {
    pluCategoryOptions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: {
            type: 'string',
          },
          label: {
            type: 'string',
          },
          children: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                key: {
                  type: 'string',
                },
                label: {
                  type: 'string',
                },
              },
              required: ['key', 'label'],
            },
          },
        },
        required: ['key', 'label', 'children'],
      },
    },
    starKisCategoryOptions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: {
            type: 'string',
          },
          label: {
            type: 'string',
          },
          children: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                key: {
                  type: 'string',
                },
                label: {
                  type: 'string',
                },
              },
              required: ['key', 'label'],
            },
          },
        },
        required: ['key', 'label', 'children'],
      },
    },
  },
  required: ['pluCategoryOptions', 'starKisCategoryOptions'],
}
