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
  groupsBy = 'id', // how to get the id of a empty column
  groupsTitle = 'name', // how to get the title of an empty column

  items,
  columnsBy = 'stage.id', // how to get the id of a column from items
  columnsTitle = 'stage.name', // how to get the title of a column
  cardsBy = 'company.id', // how to get the id of a card
  cardsTitle = 'company.name', // how to get the title of a card
  contactsId = 'id', // how to get the id of a contact
  contactsTitle = 'name' // how to get the title of a contact
}) => {
  let columns = items.reduce((result, next) => {
    const id = get(next, columnsBy);

    if (!id) {
      return result;
    }

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
      const cardId = get(next, cardsBy);

      if (!cardId) {
        return result;
      }

      const id = `${column.id}--${cardId}`;
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
