import gql from 'graphql-tag';
import get from 'lodash.get';

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

export const getType = service => service.id.split('-')[1];

export const updateBoard = ({
  groups,
  groupsBy = 'id',
  groupsTitle = 'name',

  items,
  columnsBy,
  columnsTitle,
  cardsBy,
  cardsTitle,
  contactsId = 'id',
  contactsTitle = 'name'
}) => {
  let columns = items.reduce((result, next) => {
    const id = get(next, columnsBy);
    const title = get(next, columnsTitle);

    let column = result.find(c => c.id === id);

    if (!column) {
      column = {
        id,
        title,
        cards: []
      };
      result.push(column);
    }

    column.cards.push(next);
    return result;
  }, []);

  // inner group
  columns.map(column => {
    column.cards = column.cards.reduce((result, next) => {
      const id = `${column.id}--${get(next, cardsBy)}`;
      const title = get(next, cardsTitle);

      let card = result.find(c => c.id === id);

      if (!card) {
        card = {
          id,
          title,
          contacts: [],
          index: result.length
        };
        result.push(card);
      }

      card.contacts.push({
        id: get(next, contactsId),
        title: get(next, contactsTitle),
        data: next
      });

      return result;
    }, []);

    return column;
  });

  return groups.map(group => {
    const id = get(group, groupsBy);
    const title = get(group, groupsTitle);

    const column = columns.find(c => c.id === id);

    if (column) {
      return column;
    }

    return {
      id,
      title,
      cards: []
    };
  });
};
