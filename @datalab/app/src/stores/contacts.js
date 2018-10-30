import gql from 'graphql-tag';

export const GET_CONTACTS = gql`
  {
    contacts: getAllContacts {
      id
      name
      email
      phone
      company {
        id
        name
      }
      area {
        id
        name
      }
    }
    areas: getAllAreas {
      id
      name
    }
  }
`;
