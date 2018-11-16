export const services = [
  {
    id: 'dl-messaging-google-mail-service',
    name: 'Google Mail',
    description: 'Service to send messages through Google Mail.',
    enabled: false,
    url: 'https://6jl9mysuhl.execute-api.us-east-1.amazonaws.com/dev/gql'
  },
  {
    id: 'dl-tasks-asana-service',
    name: 'Asana',
    description: 'Create tasks connected to Asana.',
    enabled: false,
    url: 'https://3fkxqlidl0.execute-api.us-east-1.amazonaws.com/dev/gql'
  },
  {
    id: 'dl-messaging-hotmail-service',
    name: 'Hotmail Mail',
    description: 'Service to send messages through Hotmail.',
    enabled: false,
    url: 'https://tzd6hneuuk.execute-api.us-east-1.amazonaws.com/dev/gql'
  },
  {
    id: 'dl-orgs-contacts-service',
    name: 'Contacts',
    description: 'Service to connect a contact list in your kanban.',
    enabled: true,
    url: 'https://tzd6hneuuk.execute-api.us-east-1.amazonaws.com/dev/gql'
  },
  {
    id: 'dl-spellcheck-alex-service',
    name: 'Alex',
    description: 'Service to spellcheck sensitive words.',
    enabled: false,
    url: null
  },
  {
    id: 'dl-spellcheck-dictionary-service',
    name: 'Dictionary',
    description: 'Service to spellcheck words based on the dictionary.',
    enabled: false,
    url: null
  }
];
