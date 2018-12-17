import React, { Component } from 'react';

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
      updateKanban,
      classes
    } = this.props;
    const columns = updateKanban({ organizations, stages });

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
