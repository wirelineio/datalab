import React, { Component } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import RootRef from '@material-ui/core/RootRef';

const styles = () => ({
  root: {
    width: '100%',
    height: '100%'
  }
});

class GridColumn extends Component {
  onDragStart = (...args) => {
    const { onDragStart } = this.props;
    this.container.classList.add('dragging');
    onDragStart && onDragStart(...args);
  };

  onDragEnd = (...args) => {
    const { onDragEnd } = this.props;
    this.container.classList.remove('dragging');
    onDragEnd && onDragEnd(...args);
  };

  render() {
    const { classes, list, children } = this.props;

    return (
      <RootRef rootRef={ref => (this.container = ref)}>
        <Grid container className={classes.root} spacing={16}>
          <DragDropContext onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
            {list.map((item, key) => (
              <Grid key={key} item xs={3}>
                {children({ item, key })}
              </Grid>
            ))}
          </DragDropContext>
        </Grid>
      </RootRef>
    );
  }
}

export default withStyles(styles)(GridColumn);
