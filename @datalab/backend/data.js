export const columns = [
  {
    id: 'column-1',
    index: 0,
    title: 'column 1',
    cards: [
      {
        id: 'card-1',
        index: 0,
        title: 'card-1'
      },
      {
        id: 'card-2',
        index: 1,
        title: 'card-2'
      },
      {
        id: 'card-3',
        index: 2,
        title: 'card-3'
      }
    ]
  },
  {
    id: 'column-2',
    index: 1,
    title: 'column 2',
    cards: [
      {
        id: 'card-21',
        index: 0,
        title: 'card-21'
      },
      {
        id: 'card-22',
        index: 1,
        title: 'card-22'
      },
      {
        id: 'card-23',
        index: 2,
        title: 'card-23'
      }
    ]
  },
  {
    id: 'column-3',
    index: 2,
    title: 'column 3',
    cards: [
      {
        id: 'card-31',
        index: 0,
        title: 'card-31'
      },
      {
        id: 'card-32',
        index: 1,
        title: 'card-32'
      },
      {
        id: 'card-33',
        index: 2,
        title: 'card-33'
      }
    ]
  }
];

export const services = [
  {
    id: 'service-1',
    type: 'messaging',
    name: 'Google Mail',
    description: 'Service to send messages through Google Mail.',
    enabled: false,
    url: 'https://6jl9mysuhl.execute-api.us-east-1.amazonaws.com/dev/gql'
  },
  {
    id: 'service-2',
    type: 'tasks',
    name: 'Asana',
    description: 'Create tasks connected to Asana.',
    enabled: false,
    url: 'https://3fkxqlidl0.execute-api.us-east-1.amazonaws.com/dev/gql'
  },
  {
    id: 'service-3',
    type: 'messaging',
    name: 'Hotmail Mail',
    description: 'Service to send messages through Hotmail.',
    enabled: false,
    url: 'https://tzd6hneuuk.execute-api.us-east-1.amazonaws.com/dev/gql'
  }
];
