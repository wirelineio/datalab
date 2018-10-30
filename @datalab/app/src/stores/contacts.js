import gql from 'graphql-tag';
import produce from 'immer';

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

export const UPDATE_MULTIPLE_CONTACTS = gql`
  mutation UpdateMultipleContacts(
    $ids: [ID!]!
    $name: String
    $email: String
    $phone: String
    $companyId: ID
    $areaId: ID
  ) {
    contacts: updateMultipleContacts(
      ids: $ids
      name: $name
      email: $email
      phone: $phone
      companyId: $companyId
      areaId: $areaId
    ) {
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
  }
`;

export const optimisticUpdateMultipleContacts = ({ contacts, areas }, variables) => {
  const { ids, ...args } = variables;

  const mutate = produce(contacts => {
    contacts.filter(c => ids.includes(c.id)).forEach(contact => {
      Object.keys(args).forEach(prop => {
        if (prop === 'areaId') {
          const area = areas.find(a => a.id === args[prop]);
          contact.area = area;
        } else {
          contact[prop] = args[prop];
        }
      });
    });
  });

  return mutate(contacts);
};
