import gql from 'graphql-tag';

export const GET_COLUMNS = gql`
  {
    columns: getAllColumns {
      id
      index
      title
      cards {
        id
        index
        title
      }
    }
  }
`;

export const UPDATE_CARD_ORDER = gql`
  mutation UpdateCardOrder($source: DroppableInput!, $destination: DroppableInput, $cardId: ID!) {
    columns: updateCardOrder(source: $source, destination: $destination, cardId: $cardId) {
      id
      index
      cards {
        id
        index
      }
    }
  }
`;

export const GET_SERVICES = gql`
  {
    services: getAllServices {
      id
      type
      name
      description
      enabled
      url
    }
  }
`;

export const SWITCH_SERVICE = gql`
  mutation SwitchService($id: ID!) {
    switchService(id: $id) {
      id
      enabled
    }
  }
`;
