import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

import AddIcon from '@material-ui/icons/Add';

import { updateKanban } from '../../stores/orgs';

import GridColumn from '../../components/dnd/GridColumn';
import Column from '../../components/dnd/Column';
import Card from '../../components/dnd/Card';

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
    const { updatePartner, moveContactToPartner } = this.props;

    if (!destination) {
      return null;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return null;
    }

    if (destination.droppableId !== source.droppableId) {
      if (type === 'CARD') {
        return updatePartner({ id: draggableId, stageId: destination.droppableId });
      }

      if (type === 'CONTACT') {
        const [contactId] = draggableId.split('|').reverse();

        return moveContactToPartner({
          id: source.droppableId,
          toPartner: destination.droppableId,
          contactId
        });
      }
    }
  };

  render() {
    const {
      partners,
      stages,
      onAddPartner,
      onEditPartner,
      onDeletePartner,
      onAddContact,
      onEditContact,
      onDeleteContact,
      onAddStage,
      onEditStage,
      onDeleteStage,
      classes
    } = this.props;
    const columns = updateKanban({ partners, stages });

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
                onAddCard={() => onAddPartner(data)}
              >
                {({ item: { id, title, index, data } }) => {
                  return (
                    <Card
                      id={id}
                      title={title}
                      index={index}
                      data={data}
                      onEditCard={() => onEditPartner(data)}
                      onDeleteCard={() => onDeletePartner(data)}
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
          <Button variant="fab" color="primary" aria-label="Add" className={classes.addCardButton} onClick={onAddStage}>
            <AddIcon />
          </Button>
        </Tooltip>
      </div>
    );
  }
}

export default withStyles(styles)(Kanban);
