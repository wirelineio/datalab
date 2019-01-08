import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  selected: {
    background: theme.palette.grey[200]
  }
});

class Sidebar extends Component {
  render() {
    const {
      classes,
      routes,
      match: { path: pathname }
    } = this.props;

    return (
      <List component="nav">
        {routes.map(({ path, icon: Icon, title }, key) => (
          <ListItem key={key} button component={Link} to={path} className={pathname === path ? classes.selected : null}>
            <Tooltip title={title} placement="right-end">
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
            </Tooltip>
            <ListItemText primary={title} />
          </ListItem>
        ))}
      </List>
    );
  }
}

export default withStyles(styles)(Sidebar);
