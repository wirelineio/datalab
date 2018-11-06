import gql from 'graphql-tag';
import get from 'lodash.get';
import produce from 'immer';

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
    }
    stages: getAllStages {
      id
      name
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

export const DELETE_STAGE = gql`
  mutation DeleteStage($id: ID!) {
    deleteStage(id: $id)
  }
`;

export const updatePartnerOptimistic = ({ partners, stages }, variables) => {
  const { id, ...args } = variables;

  const mutate = produce(partners => {
    const partner = partners.filter(p => p.id === id);

    Object.keys(args).forEach(prop => {
      if (prop === 'stageId') {
        const stage = stages.find(a => a.id === args[prop]);
        partner.stage = stage;
      } else {
        partner[prop] = args[prop];
      }
    });
  });

  return {
    partners: mutate(partners)
  };
};

export const updateKanban = ({ partners, stages }) => {
  let columns = partners.reduce(
    (result, next) => {
      const id = get(next, 'stage.id', 'uncategorized');

      if (!result[id]) {
        const title = get(next, 'stage.name');

        result[id] = {
          id,
          title,
          cards: [],
          index: Object.keys(result).length
        };
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
    },
    { uncategorized: { id: 'uncategorized', title: 'Uncategorized', cards: [], index: 0 } }
  );

  columns = stages.reduce((result, next) => {
    const id = get(next, 'stage.id', 'uncategorized');

    if (!result[id]) {
      const title = get(next, 'stage.name');

      result[id] = {
        id,
        title,
        cards: [],
        index: Object.keys(result).length
      };
    }

    return result;
  }, columns);

  columns = Object.keys(columns).map(key => columns[key]);
  columns.sort((a, b) => a.index - b.index);
  return columns;
};
