import produce from 'immer';
import gql from 'graphql-tag';

import data from '../data';

export default {
  defaults: data,
  resolvers: {
    Query: {},
    Mutation: {
      updateCardOrder: (_, { source, destination, cardId }, { cache }) => {
        if (!destination) {
          return null;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
          return null;
        }

        const mutate = produce(draft => {
          const sourceColumn = draft.columns.find(c => c.id === source.droppableId);
          const destinationColumn = draft.columns.find(c => c.id === destination.droppableId);
          const card = sourceColumn.cards.find(c => c.id === cardId);
          sourceColumn.cards.splice(source.index, 1);
          destinationColumn.cards.splice(destination.index, 0, card);
          sourceColumn.cards = sourceColumn.cards.map((card, index) => {
            card.index = index;
            return card;
          });
          if (source.droppableId === destination.droppableId) {
            return;
          }
          destinationColumn.cards = destinationColumn.cards.map((card, index) => {
            card.index = index;
            return card;
          });
        });

        const oldData = cache.readQuery({ query: GET_COLUMNS });
        const newData = mutate(oldData);
        cache.writeQuery({ query: GET_COLUMNS, data: newData });
        return newData;
      },
      switchService: (_, { id: serviceId }, { cache }) => {
        const id = `Service:${serviceId}`;
        const fragment = gql`
          fragment enabledService on Service {
            enabled
          }
        `;
        const service = cache.readFragment({ fragment, id });
        const data = { ...service, enabled: !service.enabled };
        cache.writeData({ id, data });
        return null;
      }
    }
  }
};

export const GET_COLUMNS = gql`
  {
    columns @client {
      id
      title
      cards {
        id
        title
      }
    }
  }
`;

export const UPDATE_CARD_ORDER = gql`
  mutation UpdateCardOrder($source: droppable!, $destination: droppable, $cardId: ID!) {
    updateCardOrder(source: $source, destination: $destination, cardId: $cardId) @client
  }
`;

export const GET_SERVICES = gql`
  {
    services @client {
      id
      type
      name
      description
      enabled
    }
  }
`;

export const SWITCH_SERVICE = gql`
  mutation SwitchService($id: ID!) {
    switchService(id: $id) @client
  }
`;
