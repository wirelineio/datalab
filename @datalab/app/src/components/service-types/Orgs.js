import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: theme.spacing.unit
  }
});

const firstLetters = name =>
  name
    .toUpperCase()
    .split(' ')
    .slice(0, 2)
    .map(word => word[0])
    .join('');

const Orgs = ({ classes, contacts = [] }) => {
  return (
    <div className={classes.root}>
      {contacts.map(contact => (
        <Chip
          key={contact.id}
          avatar={<Avatar>{firstLetters(contact.name)}</Avatar>}
          label={contact.name}
          className={classes.chip}
        />
      ))}
    </div>
  );
};
export default withStyles(styles)(Orgs);
