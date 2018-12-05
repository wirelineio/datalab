import gql from 'graphql-tag';

export const GET_ALL_REMOTE_CONTACTS = gql`
  query GetAllContacts {
    contacts: getAllContacts {
      id
      name
      email
      phone
      _serviceId @service
      _serviceType @service
    }
  }
`;
