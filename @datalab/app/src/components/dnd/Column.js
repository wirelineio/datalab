import React, { Component, Fragment } from 'react';
import { Droppable } from 'react-beautiful-dnd';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import RootRef from '@material-ui/core/RootRef';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const styles = () => ({
  root: {
    background: '#e0e0e0',
    '.dragging &:hover': {
      background: '#9fa6d0'
    },
    '.dragging &:hover .column-title': {
      color: '#fff'
    }
  },
  cards: {
    flex: 1,
    minHeight: 100
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
});

class Column extends Component {
  state = {
    anchorEl: null
  };

  close = cb => {
    this.setState({ anchorEl: null }, cb);
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.close();
  };

  handleAddCard = () => {
    const { onAddCard } = this.props;
    this.close(() => {
      if (onAddCard) {
        onAddCard();
      }
    });
  };

  handleEditColumn = () => {
    const { onEditColumn } = this.props;
    this.close(() => {
      if (onEditColumn) {
        onEditColumn();
      }
    });
  };

  handleDeleteColumn = () => {
    const { onDeleteColumn } = this.props;
    this.close(() => {
      if (onDeleteColumn) {
        onDeleteColumn();
      }
    });
  };

  renderActionMenu() {
    const { id } = this.props;
    const { anchorEl } = this.state;

    const menuId = `${id}-action-menu`;

    return (
      <Fragment>
        <IconButton aria-owns={anchorEl ? menuId : undefined} aria-haspopup="true" onClick={this.handleClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu id={menuId} anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
          <MenuItem onClick={this.handleAddCard}>Add record</MenuItem>
          {id !== 'uncategorized' && <MenuItem onClick={this.handleEditColumn}>Edit stage</MenuItem>}
          {id !== 'uncategorized' && <MenuItem onClick={this.handleDeleteColumn}>Delete stage</MenuItem>}
        </Menu>
      </Fragment>
    );
  }

  render() {
    const { id, title, list, classes, children } = this.props;
    return (
      <Card className={classes.root} elevation={0}>
        <CardHeader title={title} action={this.renderActionMenu()} />
        <CardContent>
          <Droppable droppableId={id}>
            {provided => (
              <RootRef rootRef={provided.innerRef}>
                <Grid container item className={classes.cards} direction="column" {...provided.droppableProps}>
                  {list.map((item, key) => (
                    <Grid key={key} item>
                      {children({ item, key })}
                    </Grid>
                  ))}
                  {provided.placeholder}
                </Grid>
              </RootRef>
            )}
          </Droppable>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(Column);
