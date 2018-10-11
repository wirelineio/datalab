export default {
  columns: [
    {
      id: 'column-1',
      __typename: 'Column',
      title: 'column 1',
      cards: [
        {
          id: 'task-1',
          __typename: 'Card',
          title: 'task-1'
        },
        {
          id: 'task-2',
          __typename: 'Card',
          title: 'task-2'
        },
        {
          id: 'task-3',
          __typename: 'Card',
          title: 'task-3'
        }
      ]
    },
    {
      id: 'column-2',
      __typename: 'Column',
      title: 'column 2',
      cards: [
        {
          id: 'task-21',
          __typename: 'Card',
          title: 'task-21'
        },
        {
          id: 'task-22',
          __typename: 'Card',
          title: 'task-22'
        },
        {
          id: 'task-23',
          __typename: 'Card',
          title: 'task-23'
        }
      ]
    },
    {
      id: 'column-3',
      __typename: 'Column',
      title: 'column 3',
      cards: [
        {
          id: 'task-31',
          __typename: 'Card',
          title: 'task-31'
        },
        {
          id: 'task-32',
          __typename: 'Card',
          title: 'task-32'
        },
        {
          id: 'task-33',
          __typename: 'Card',
          title: 'task-33'
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
      enabled: false
    },
    {
      id: 'service-2',
      __typename: 'Service',
      type: 'tasks',
      name: 'Asana',
      description: 'Create tasks connected to Asana.',
      enabled: true
    },
    {
      id: 'service-3',
      __typename: 'Service',
      type: 'contacts',
      name: 'LinkedIn',
      description: 'Check your contacts from LinkedIn.',
      enabled: false
    }
  ]
};
