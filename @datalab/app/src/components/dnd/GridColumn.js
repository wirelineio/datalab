import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const styles = () => ({
  root: {
    width: '100%',
    height: '100%'
  }
});

function GridColumn(props) {
  const { classes, list, children, onDragEnd } = props;

  return (
    <Grid container className={classes.root} spacing={16}>
      <DragDropContext onDragEnd={onDragEnd}>
        {list.map((item, key) => (
          <Grid key={key} item xs={3}>
            {children({ item, key })}
          </Grid>
        ))}
      </DragDropContext>
    </Grid>
  );
}

export default withStyles(styles)(GridColumn);
