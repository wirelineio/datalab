import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';

import { GET_COLUMNS, UPDATE_CARD_ORDER } from '../stores/board';
import GridColumn from '../components/dnd/GridColumn';
import Column from '../components/dnd/Column';
import Card from '../components/dnd/Card';

class Main extends Component {
  handleOrder = result => {
    const { source, destination, draggableId } = result;
    const { updateCardOrder } = this.props;

    return updateCardOrder(source, destination, draggableId);
  };

  render() {
    const { columns } = this.props;

    return (
      <GridColumn list={columns} onDragEnd={this.handleOrder}>
        {({ item: column }) => {
          return (
            <Column id={column.id} title={column.title} list={column.cards}>
              {({ item: card, key }) => <Card id={card.id} title={card.title} index={key} />}
            </Column>
          );
        }}
      </GridColumn>
    );
  }
}

export default compose(
  graphql(GET_COLUMNS, {
    props({ data: { columns } }) {
      return { columns };
    }
  }),
  graphql(UPDATE_CARD_ORDER, {
    props({ mutate }) {
      return {
        updateCardOrder: (source, destination, cardId) => {
          return mutate({
            variables: {
              source,
              destination,
              cardId
            }
          });
        }
      };
    }
  })
)(Main);
