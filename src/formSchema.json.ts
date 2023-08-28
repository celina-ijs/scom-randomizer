const theme = {
  type: 'object',
  properties: {
    backgroundColor: {
      type: 'string',
      format: 'color'
    },
    fontColor: {
      type: 'string',
      format: 'color'
    },
    winningNumberBackgroundColor: {
      type: 'string',
      format: 'color'
    },
    winningNumberFontColor: {
      type: 'string',
      format: 'color'
    },
    roundNumberFontColor: {
      type: 'string',
      format: 'color'
    },
    nextDrawFontColor: {
      type: 'string',
      format: 'color'
    }
  }
}

export default {
  dataSchema: {
    type: 'object',
    properties: {
      releaseUTCTime: {
        title: 'Release UTC Time',
        type: 'string',
        format: 'date-time'
      },
      // releaseTime: {
      //   type: 'string',
      //   format: 'date-time'
      // },
      numberOfValues: {
        type: 'number'
      },
      from: {
        type: 'number'
      },
      to: {
        type: 'number'
      },
      dark: theme,
      light: theme
    }
  },
  uiSchema: {
    type: 'Categorization',
    elements: [
      {
        type: 'Category',
        label: 'General',
        elements: [
          {
            type: 'VerticalLayout',
            elements: [
              {
                type: 'Control',
                scope: '#/properties/releaseUTCTime'
              },
              {
                type: 'Control',
                scope: '#/properties/numberOfValues'
              },
              {
                type: 'Control',
                scope: '#/properties/from'
              },
              {
                type: 'Control',
                scope: '#/properties/to'
              }
            ]
          }
        ]
      },
      {
        type: 'Category',
        label: 'Theme',
        elements: [
          {
            type: 'VerticalLayout',
            elements: [
              {
                type: 'Control',
                label: 'Dark',
                scope: '#/properties/dark'
              },
              {
                type: 'Control',
                label: 'Light',
                scope: '#/properties/light'
              }
            ]
          }
        ]
      }
    ]
  }
}