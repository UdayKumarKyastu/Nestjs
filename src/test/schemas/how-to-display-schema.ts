export const howToDisplaySchema = {
  type: 'object',
  properties: {
    options: {
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
  required: ['options'],
}
