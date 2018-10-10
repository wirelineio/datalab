import React, { Component } from 'react';
import produce from 'immer';

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

    const newState = produce(draft => {
      const sourceColumn = draft.columns.find(c => c.id === source.droppableId);
      const destinationColumn = draft.columns.find(c => c.id === destination.droppableId);
      const card = sourceColumn.cards.find(c => c.id === draggableId);

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

    this.setState(newState);
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
