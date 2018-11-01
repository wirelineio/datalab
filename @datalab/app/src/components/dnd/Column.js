import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import RootRef from '@material-ui/core/RootRef';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import IconButton from '@material-ui/core/IconButton';
import IconDelete from '@material-ui/icons/Delete';
import IconAdd from '@material-ui/icons/Add';

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

const Column = ({ id, title, list, classes, children, onDelete, onAdd }) => {
  return (
    <Card className={classes.root} elevation={0}>
      <CardHeader title={title} />
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
      <CardActions className={classes.actions} disableActionSpacing>
        <IconButton aria-label="Delete" onClick={onDelete}>
          <IconDelete />
        </IconButton>
        <IconButton aria-label="Delete" onClick={onAdd}>
          <IconAdd />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default withStyles(styles)(Column);
