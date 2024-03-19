export const labellingOptionsSchema = {
  type: 'object',
  properties: {
    useBy: {
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
    sellBy: {
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
    instructionsForUse: {
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
  required: ['useBy', 'sellBy', 'instructionsForUse'],
}
