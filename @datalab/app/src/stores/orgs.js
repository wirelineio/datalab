import gql from 'graphql-tag';
import get from 'lodash.get';
import { produce } from 'immer';

export const GET_ALL_ORGANIZATIONS = gql`
  query GetAllOrganizations {
    organizations: getAllOrganizations {
      id
      name
      url
      goals
      stage {
        id
        name
      }
      contacts {
        id
        name
        email
        phone
        ref {
          id
          serviceId
        }
      }
    }
    stages: getAllStages {
      id
      name
    }
  }
`;

export const CREATE_CONTACT = gql`
  mutation CreateContact($ref: InputRemoteReference!, $data: InputRemoteContact) {
    contact: createContact(ref: $ref, data: $data) {
      id
      name
      email
      phone
      ref {
        id
        serviceId
      }
    }
  }
`;

export const UPDATE_CONTACT = gql`
  mutation UpdateContact($id: ID!, $name: String, $email: String, $phone: String, $ref: InputRemoteReference) {
    contact: updateContact(id: $id, name: $name, email: $email, phone: $phone, ref: $ref) {
      id
      name
      email
      phone
      ref {
        id
        serviceId
      }
    }
  }
`;

export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($name: String!, $url: String, $goals: String, $stageId: ID) {
    organization: createOrganization(name: $name, url: $url, goals: $goals, stageId: $stageId) {
      id
      name
      url
      goals
      stage {
        id
        name
      }
      contacts {
        id
        name
        email
        phone
        ref {
          id
          serviceId
        }
      }
    }
  }
`;

export const UPDATE_ORGANIZATION = gql`
  mutation UpdateOrganization($id: ID!, $name: String, $url: String, $goals: String, $stageId: ID) {
    organization: updateOrganization(id: $id, name: $name, url: $url, goals: $goals, stageId: $stageId) {
      id
      name
      url
      goals
      stage {
        id
        name
      }
      contacts {
        id
        name
        email
        phone
        ref {
          id
          serviceId
        }
      }
    }
  }
`;

export const ADD_CONTACT_TO_ORGANIZATION = gql`
  mutation AddContactToOrganization($id: ID!, $contactId: ID!) {
    organization: addContactToOrganization(id: $id, contactId: $contactId) {
      id
      name
      url
      goals
      stage {
        id
        name
      }
      contacts {
        id
        name
        email
        phone
        ref {
          id
          serviceId
        }
      }
    }
  }
`;

export const DELETE_CONTACT_TO_ORGANIZATION = gql`
  mutation DeleteContactToOrganization($id: ID!, $contactId: ID!) {
    organization: deleteContactToOrganization(id: $id, contactId: $contactId) {
      id
      name
      url
      goals
      stage {
        id
        name
      }
      contacts {
        id
        name
        email
        phone
        ref {
          id
          serviceId
        }
      }
    }
  }
`;

export const MOVE_CONTACT_TO_ORGANIZATION = gql`
  mutation MoveContactToOrganization($id: ID!, $toOrganization: ID!, $contactId: ID!) {
    organizations: moveContactToOrganization(id: $id, toOrganization: $toOrganization, contactId: $contactId) {
      id
      name
      url
      goals
      stage {
        id
        name
      }
      contacts {
        id
        name
        email
        phone
        ref {
          id
          serviceId
        }
      }
    }
  }
`;

export const DELETE_ORGANIZATION = gql`
  mutation DeleteOrganization($id: ID!) {
    deleteOrganization(id: $id)
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

export const UPDATE_STAGE = gql`
  mutation UpdateStage($id: ID!, $name: String!) {
    stage: updateStage(id: $id, name: $name) {
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

export const updateOrganizationOptimistic = ({ organizations, stages }, variables) => {
  const { id, stageId, ...args } = variables;

  const organization = organizations.find(p => p.id === id);

  const newOrganization = {
    stage: null,
    ...args
  };

  if (stageId) {
    const stage = stages.find(a => a.id === stageId);
    newOrganization.stage = stage ? stage : null;
  }

  return {
    organization: {
      ...organization,
      ...newOrganization
    }
  };
};

export const updateContactToOrganizationOtimistic = ({ organizations }, variables) => {
  const { id, toOrganization, contactId } = variables;

  const mutate = produce(organizations => {
    const oldOrganization = organizations.find(p => p.id === id);
    const contact = oldOrganization.contacts.find(c => c.id === contactId);

    // delete old
    oldOrganization.contacts = oldOrganization.contacts.filter(c => c.id !== contactId);

    const newOrganization = organizations.find(p => p.id === toOrganization && !p.contacts.find(c => c.id === contactId));

    // check if the contact is not already there
    if (newOrganization) {
      newOrganization.contacts = [...newOrganization.contacts, contact];
    }
  });

  return {
    organizations: mutate(organizations)
  };
};

export const updateKanban = ({ organizations, stages }) => {
  let columns = stages.reduce(
    (result, next) => {
      const id = get(next, 'id', 'uncategorized');

      if (!result[id]) {
        const title = get(next, 'name');

        result[id] = {
          id,
          title,
          data: next,
          cards: []
        };
      }

      return result;
    },
    { uncategorized: { id: 'uncategorized', title: 'Uncategorized', cards: [], index: 0, data: null } }
  );

  columns = organizations.reduce((result, next) => {
    let id = get(next, 'stage.id', 'uncategorized');

    if (!result[id]) {
      // missing stage
      id = 'uncategorized';
    }

    const cardId = get(next, 'id');
    const cardTitle = get(next, 'name');
    const card = {
      id: cardId,
      title: cardTitle,
      data: next,
      index: result[id].cards.length
    };

    result[id].cards.push(card);

    return result;
  }, columns);

  columns = Object.keys(columns).map(key => columns[key]);
  columns.sort((a, b) => {
    a = a.title.toLowerCase();
    b = b.title.toLowerCase();

    return a > b ? -1 : b > a ? 1 : 0;
  });

  const first = columns.filter(c => c.id === 'uncategorized');
  const second = columns.filter(c => c.id !== 'uncategorized');

  return [...first, ...second];
};
