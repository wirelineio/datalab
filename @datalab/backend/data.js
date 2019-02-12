export const services = [
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
    services: []
  },
  {
    id: 'template',
    services: [
      {
        id: 'example.com/datalab-spellcheck',
        enabled: true
      },
      {
        id: 'example.com/datalab-contacts',
        enabled: true
      },
    ]
  }
];
