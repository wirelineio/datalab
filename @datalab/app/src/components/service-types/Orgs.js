import React, { Component, Fragment } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Menu from '@material-ui/core/Menu';
import RootRef from '@material-ui/core/RootRef';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    minHeight: 100
  },
  chip: {
    margin: theme.spacing.unit
  }
});

class Orgs extends Component {
  state = {
    anchorEl: null,
    menuId: null
  };

  close = cb => {
    this.setState({ anchorEl: null, menuId: null }, cb);
  };

  handleClick = (menuId, event) => {
    this.setState({ anchorEl: event.currentTarget, menuId });
  };

  handleClose = () => {
    this.close();
  };

  handleEditContact = contact => {
    const { onEditContact } = this.props;
    this.close(() => {
      if (onEditContact) {
        onEditContact(contact);
      }
    });
  };

  handleDeleteContact = contact => {
    const { onDeleteColumn } = this.props;
    this.close(() => {
      if (onDeleteColumn) {
        onDeleteColumn(contact);
      }
    });
  };

  renderContact(contact, index) {
    const { anchorEl, menuId } = this.state;
    const { classes, id: organizationId } = this.props;

    const id = `${organizationId}|${contact.id}`;

    return (
      <Fragment key={id}>
        <Draggable draggableId={id} index={index} type="CONTACT">
          {provided => (
            <RootRef rootRef={provided.innerRef}>
              <Chip
                label={contact.name}
                className={classes.chip}
                onDelete={this.handleClick.bind(this, id)}
                deleteIcon={<MoreVertIcon />}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              />
            </RootRef>
          )}
        </Draggable>
        <Menu id={id} anchorEl={anchorEl} open={menuId === id} onClose={this.handleClose}>
          <MenuItem onClick={this.handleEditContact.bind(this, contact)}>Edit contact</MenuItem>
          <MenuItem onClick={this.handleDeleteContact.bind(this, contact)}>Delete contact</MenuItem>
        </Menu>
      </Fragment>
    );
  }

  render() {
    const { id, classes, contacts = [] } = this.props;
    return (
      <Droppable droppableId={id} type="CONTACT">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps} className={classes.root}>
            {contacts.map((contact, index) => this.renderContact(contact, index))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }
}

export default withStyles(styles)(Orgs);
