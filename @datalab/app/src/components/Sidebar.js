import React, { Component} from 'react';
import { Link } from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

export default class Sidebar extends Component {
  render(){
    const { routes } = this.props;

    return (
      <List component="nav">
        {routes.map(({ path, icon: Icon, title }, key) => (
          <ListItem key={key} button component={Link} to={path}>
            <ListItemIcon><Icon /></ListItemIcon>
            <ListItemText primary={title} />
          </ListItem>
        ))}
      </List>
    );
  }
}