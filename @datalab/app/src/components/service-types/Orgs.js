import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
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
    .map(word => word[0])
    .join('');

const Orgs = ({ classes, contacts = [] }) => {
  return (
    <div className={classes.root}>
      {contacts.map(contact => (
        <Chip
          key={contact.id}
          avatar={<Avatar>{firstLetters(contact.title)}</Avatar>}
          label={contact.title}
          className={classes.chip}
        />
      ))}
    </div>
  );
};
export default withStyles(styles)(Orgs);
