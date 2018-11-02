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
      stage {
        id
        name
      }
    }
    stages: getAllStages {
      id
      name
    }
    companies: getAllCompanies {
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
    $stageId: ID
  ) {
    contacts: updateMultipleContacts(
      ids: $ids
      name: $name
      email: $email
      phone: $phone
      companyId: $companyId
      stageId: $stageId
    ) {
      id
      name
      email
      phone
      company {
        id
        name
      }
      stage {
        id
        name
      }
    }
  }
`;

export const UPDATE_OR_CREATE_CONTACTS = gql`
  mutation UpdateOrCreateContacts($contacts: [ContactInput!]!) {
    contacts: updateOrCreateContacts(contacts: $contacts) {
      id
      name
      email
      phone
      company {
        id
        name
      }
      stage {
        id
        name
      }
    }
  }
`;

export const CREATE_STAGE = gql`
  mutation CreateStage($name: String!) {
    stage: createStage(name: $name) {
      id
      name
    }
  }
`;

export const DELETE_STAGE = gql`
  mutation DeleteStage($id: ID!) {
    deleteStage(id: $id)
  }
`;

export const CREATE_COMPANY = gql`
  mutation CreateCompany($name: String!) {
    company: createCompany(name: $name) {
      id
      name
    }
  }
`;

export const optimisticUpdateMultipleContacts = ({ contacts, stages }, variables) => {
  const { ids, ...args } = variables;

  const mutate = produce(contacts => {
    contacts.filter(c => ids.includes(c.id)).forEach(contact => {
      Object.keys(args).forEach(prop => {
        if (prop === 'stageId') {
          const stage = stages.find(a => a.id === args[prop]);
          contact.stage = stage;
        } else {
          contact[prop] = args[prop];
        }
      });
    });
  });

  return mutate(contacts);
};
