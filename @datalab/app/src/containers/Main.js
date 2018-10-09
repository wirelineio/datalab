import React, { Component } from 'react';

import GridColumn from '../components/dnd/GridColumn';
import Column from '../components/dnd/Column';
import Card from '../components/dnd/Card';

import data from '../data';

class Main extends Component {
  state = data;

  handleOrder = result => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const column = this.state.columns.find(c => c.id === destination.droppableId);
    const card = column.cards.find(c => c.id === draggableId);
    const newCards = [...column.cards];
    newCards.splice(source.index, 1);
    newCards.splice(destination.index, 0, card);

    const newColumn = {
      ...column,
      cards: newCards
    };

    const columns = [...this.state.columns];
    columns[columns.findIndex(c => c.id === newColumn.id)] = newColumn;
    this.setState({ columns });
  };

  render() {
    return (
      <GridColumn list={this.state.columns} onDragEnd={this.handleOrder}>
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

export default Main;
