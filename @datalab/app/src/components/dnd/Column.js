import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import RootRef from '@material-ui/core/RootRef';

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
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
  }
});

const Column = ({ id, title, list, classes, children }) => {
  return (
    <Paper className={classes.root} elevation={0}>
      <Typography variant="h6" gutterBottom className="column-title">
        {title}
      </Typography>
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
    </Paper>
  );
};

export default withStyles(styles)(Column);
