import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import grey from '@material-ui/core/colors/grey';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = () => ({
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: 0,
    paddingBottom: 0
  },
  avatar: {
    backgroundColor: red[500]
  },
  message: {
    borderBottom: `1px solid ${grey[300]}`,
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  messageContent: {
    paddingTop: 0,
    paddingBottom: 0
  }
});

class Message extends Component {
  render() {
    const { classes, message } = this.props;

    return (
      <Grid item className={classes.message}>
        <CardHeader
          avatar={
            <Avatar aria-label="From" className={classes.avatar}>
              {message.from.slice(0, 2).toUpperCase()}
            </Avatar>
          }
          title={<Typography variant="caption">@{message.from}</Typography>}
          subheader={
            <Typography variant="caption" color="textSecondary">
              September 14, 2016
            </Typography>
          }
        />
        <CardContent className={classes.messageContent}>
          <Typography component="p">
            This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup
            of frozen peas along with the mussels, if you like.
          </Typography>
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton aria-label="Edit">
            <EditIcon />
          </IconButton>
          <IconButton aria-label="Delete">
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Grid>
    );
  }
}

class Messaging extends Component {
  render() {
    const { messages = [], classes } = this.props;

    return (
      <Grid container direction="column">
        {messages.map((row, key) => (
          <Message key={key} message={row} classes={classes} />
        ))}
      </Grid>
    );
  }
}

export default withStyles(styles)(Messaging);
