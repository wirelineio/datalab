export const services = [
  {
    id: 'dl-messaging-google-mail-service',
    name: 'Google Mail',
    description: 'Service to send messages through Google Mail.',
    url: 'https://6jl9mysuhl.execute-api.us-east-1.amazonaws.com/dev/gql'
  },
  {
    id: 'dl-tasks-asana-service',
    name: 'Asana',
    description: 'Create tasks connected to Asana.',
    url: 'https://3fkxqlidl0.execute-api.us-east-1.amazonaws.com/dev/gql'
  },
  {
    id: 'dl-messaging-hotmail-service',
    name: 'Hotmail Mail',
    description: 'Service to send messages through Hotmail.',
    url: 'https://tzd6hneuuk.execute-api.us-east-1.amazonaws.com/dev/gql'
  },
  {
    id: 'dl-orgs-contacts-service',
    name: 'Contacts',
    description: 'Service to connect a contact list in your kanban.',
    url: 'https://tzd6hneuuk.execute-api.us-east-1.amazonaws.com/dev/gql'
  },
  {
    id: 'dl-spellcheck-alex-service',
    name: 'Alex',
    description: 'Service to spellcheck sensitive words.',
    url: null
  },
  {
    id: 'dl-spellcheck-dictionary-service',
    name: 'Dictionary',
    description: 'Service to spellcheck words based on the dictionary.',
    url: null
  }
];

export const profiles = [
  {
    id: 'admin',
    services: [{ id: 'dl-orgs-contacts-service', enabled: true }]
  }
];
