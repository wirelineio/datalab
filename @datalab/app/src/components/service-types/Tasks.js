import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  }
});

class Tasks extends Component {
  static defaultProps = {
    tasks: []
  };

  handleToggle = task => {
    const { toggleTask } = this.props;
    toggleTask(task);
  };

  render() {
    const { classes, tasks } = this.props;

    return (
      <div className={classes.root}>
        <List>
          {tasks.map(task => (
            <ListItem key={task.id} dense button className={classes.listItem}>
              <ListItemText primary={task.content} />
              <ListItemSecondaryAction>
                <Checkbox onChange={this.handleToggle.bind(this, task)} checked={task.done} />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(Tasks);
