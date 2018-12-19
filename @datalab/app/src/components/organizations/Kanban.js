import React, { Component } from 'react';
import get from 'lodash.get';

import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

import AddIcon from '@material-ui/icons/Add';

import GridColumn from '../dnd/GridColumn';
import Column from '../dnd/Column';
import Card from '../dnd/Card';

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3
  },
  addCardButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%'
  }
});

class Kanban extends Component {
  handleOrder = result => {
    const { source, destination, draggableId, type } = result;
    const { updateOrganization, moveContactToOrganization } = this.props;

    if (!destination) {
      return null;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return null;
    }

    if (destination.droppableId !== source.droppableId) {
      if (type === 'CARD') {
        return updateOrganization({ id: draggableId, stageId: destination.droppableId });
      }

      if (type === 'CONTACT') {
        const [contactId] = draggableId.split('|').reverse();

        return moveContactToOrganization({
          id: source.droppableId,
          toOrganization: destination.droppableId,
          contactId
        });
      }
    }
  };

  updateKanban = ({ organizations, stages }) => {
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

    columns = organizations.reduce((result, next) => {
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

  render() {
    const {
      organizations,
      stages,
      onAddOrganization,
      onEditOrganization,
      onDeleteOrganization,
      onAddContact,
      onEditContact,
      onDeleteContact,
      onAddStage,
      onEditStage,
      onDeleteStage,
      onImportOrganization,
      classes
    } = this.props;
    const columns = this.updateKanban({ organizations, stages });

    return (
      <div className={classes.root}>
        <GridColumn list={columns} onDragEnd={this.handleOrder}>
          {({ item: { id, title, cards, index, data } }) => {
            return (
              <Column
                id={id}
                title={title}
                list={cards}
                index={index}
                onEditColumn={() => onEditStage(data)}
                onDeleteColumn={() => onDeleteStage(data)}
                onAddCard={() => onAddOrganization(data)}
                onImportOrganization={() => onImportOrganization(data)}
              >
                {({ item: { id, title, index, data } }) => {
                  return (
                    <Card
                      id={id}
                      title={title}
                      index={index}
                      data={data}
                      onEditCard={() => onEditOrganization(data)}
                      onDeleteCard={() => onDeleteOrganization(data)}
                      onAddContact={() => onAddContact(data)}
                      onEditContact={onEditContact}
                      onDeleteContact={onDeleteContact}
                    />
                  );
                }}
              </Column>
            );
          }}
        </GridColumn>
        <Tooltip title="Add Column">
          <Fab color="primary" aria-label="Add" className={classes.addCardButton} onClick={onAddStage}>
            <AddIcon />
          </Fab>
        </Tooltip>
      </div>
    );
  }
}

export default withStyles(styles)(Kanban);
