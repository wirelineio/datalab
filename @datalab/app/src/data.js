export default {
  columns: [
    {
      id: 'column-1',
      __typename: 'Column',
      title: 'column 1',
      cards: [
        {
          id: 'card-1',
          __typename: 'Card',
          title: 'card-1'
        },
        {
          id: 'card-2',
          __typename: 'Card',
          title: 'card-2'
        },
        {
          id: 'card-3',
          __typename: 'Card',
          title: 'card-3'
        }
      ]
    },
    {
      id: 'column-2',
      __typename: 'Column',
      title: 'column 2',
      cards: [
        {
          id: 'card-21',
          __typename: 'Card',
          title: 'card-21'
        },
        {
          id: 'card-22',
          __typename: 'Card',
          title: 'card-22'
        },
        {
          id: 'card-23',
          __typename: 'Card',
          title: 'card-23'
        }
      ]
    },
    {
      id: 'column-3',
      __typename: 'Column',
      title: 'column 3',
      cards: [
        {
          id: 'card-31',
          __typename: 'Card',
          title: 'card-31'
        },
        {
          id: 'card-32',
          __typename: 'Card',
          title: 'card-32'
        },
        {
          id: 'card-33',
          __typename: 'Card',
          title: 'card-33'
        }
      ]
    }
  ],
  services: [
    {
      id: 'service-1',
      __typename: 'Service',
      type: 'messaging',
      name: 'Google Mail',
      description: 'Service to send messages through Google Mail.',
      enabled: true,
      url: 'https://09fxpdbua5.execute-api.us-east-1.amazonaws.com/dev/gql'
    },
    {
      id: 'service-2',
      __typename: 'Service',
      type: 'tasks',
      name: 'Asana',
      description: 'Create tasks connected to Asana.',
      enabled: false,
      url: 'https://ayfgdg9orh.execute-api.us-east-1.amazonaws.com/dev/gql'
    },
    {
      id: 'service-3',
      __typename: 'Service',
      type: 'contacts',
      name: 'LinkedIn',
      description: 'Check your contacts from LinkedIn.',
      enabled: false,
      url: null
    },
    {
      id: 'service-4',
      __typename: 'Service',
      type: 'messaging',
      name: 'Hotmail Mail',
      description: 'Service to send messages through Hotmail.',
      enabled: true,
      url: 'https://r0zpvjmdck.execute-api.us-east-1.amazonaws.com/dev/gql'
    }
  ]
};
