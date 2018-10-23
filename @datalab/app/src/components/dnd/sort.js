import produce from 'immer';

export default (data, source, destination, cardId) => {
  if (!destination) {
    return null;
  }

  if (destination.droppableId === source.droppableId && destination.index === source.index) {
    return null;
  }

  const mutate = produce(columns => {
    const sourceColumn = columns.find(c => c.id === source.droppableId);
    const destinationColumn = columns.find(c => c.id === destination.droppableId);
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

  return mutate(data);
};
