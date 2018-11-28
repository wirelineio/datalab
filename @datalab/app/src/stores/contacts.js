import gql from 'graphql-tag';

export const GET_ALL_REMOTE_CONTACTS = gql`
  query GetAllContacts {
    contacts: getAllContacts {
      id
      name
      email
      phone
      __serviceId @skip(if: true)
      __serviceType @skip(if: true)
    }
  }
`;
