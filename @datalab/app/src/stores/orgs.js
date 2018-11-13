import gql from 'graphql-tag';
import get from 'lodash.get';
import { produce } from 'immer';

export const GET_ALL_PARTNERS = gql`
  query GetAllPartners {
    partners: getAllPartners {
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
      }
    }
    stages: getAllStages {
      id
      name
    }
  }
`;

export const CREATE_CONTACT = gql`
  mutation CreateContact($name: String!, $email: String, $phone: String) {
    contact: createContact(name: $name, email: $email, phone: $phone) {
      id
      name
      email
      phone
    }
  }
`;

export const UPDATE_CONTACT = gql`
  mutation UpdateContact($id: ID!, $name: String, $email: String, $phone: String) {
    contact: updateContact(id: $id, name: $name, email: $email, phone: $phone) {
      id
      name
      email
      phone
    }
  }
`;

export const CREATE_PARTNER = gql`
  mutation CreatePartner($name: String!, $url: String, $goals: String, $stageId: ID) {
    partner: createPartner(name: $name, url: $url, goals: $goals, stageId: $stageId) {
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
      }
    }
  }
`;

export const UPDATE_PARTNER = gql`
  mutation UpdatePartner($id: ID!, $name: String, $url: String, $goals: String, $stageId: ID) {
    partner: updatePartner(id: $id, name: $name, url: $url, goals: $goals, stageId: $stageId) {
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
      }
    }
  }
`;

export const ADD_CONTACT_TO_PARTNER = gql`
  mutation AddContactToPartner($id: ID!, $contactId: ID!) {
    partner: addContactToPartner(id: $id, contactId: $contactId) {
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
      }
    }
  }
`;

export const DELETE_CONTACT_TO_PARTNER = gql`
  mutation DeleteContactToPartner($id: ID!, $contactId: ID!) {
    partner: deleteContactToPartner(id: $id, contactId: $contactId) {
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
      }
    }
  }
`;

export const MOVE_CONTACT_TO_PARTNER = gql`
  mutation MoveContactToPartner($id: ID!, $toPartner: ID!, $contactId: ID!) {
    partners: moveContactToPartner(id: $id, toPartner: $toPartner, contactId: $contactId) {
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
      }
    }
  }
`;

export const DELETE_PARTNER = gql`
  mutation DeletePartner($id: ID!) {
    deletePartner(id: $id)
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

export const updatePartnerOptimistic = ({ partners, stages }, variables) => {
  const { id, stageId, ...args } = variables;

  const partner = partners.find(p => p.id === id);

  const newPartner = {
    stage: null,
    ...args
  };

  if (stageId) {
    const stage = stages.find(a => a.id === stageId);
    newPartner.stage = stage ? stage : null;
  }

  return {
    partner: {
      ...partner,
      ...newPartner
    }
  };
};

export const updateContactToPartnerOtimistic = ({ partners }, variables) => {
  const { id, toPartner, contactId } = variables;

  const mutate = produce(partners => {
    const oldPartner = partners.find(p => p.id === id);
    const newPartner = partners.find(p => p.id === toPartner);

    const contact = oldPartner.contacts.find(c => c.id === contactId);
    oldPartner.contacts = oldPartner.contacts.filter(c => c.id !== contactId);
    newPartner.contacts = [...newPartner.contacts, contact];
  });

  return {
    partners: mutate(partners)
  };
};

export const updateKanban = ({ partners, stages }) => {
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

  columns = partners.reduce((result, next) => {
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
