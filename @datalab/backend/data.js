export const services = [
  {
    id: 'datalab-contacts',
    name: 'Contacts',
    description: 'Service to connect a contact list in your kanban.',
    url: 'https://tzd6hneuuk.execute-api.us-east-1.amazonaws.com/dev/gql'
  },
  {
    id: 'datalab-spellcheck',
    name: 'Dictionary',
    description: 'Service to spellcheck words based on the dictionary.',
    url: null
  }
];

export const profiles = [
  {
    id: 'admin',
    services: [{ id: 'datalab-contacts', enabled: true }]
  }
];
