import React, { Component, Fragment } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const styles = theme => ({
  root: {
    cursor: 'pointer',
    borderBottom: `2px solid ${theme.palette.error.dark}`
  },
  list: {
    maxHeight: 200,
    overflow: 'auto',
    width: '100%',
    backgroundColor: theme.palette.background.paper
  }
});

class WordError extends Component {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  };

  handleFix = suggestion => {
    const { start, end, onFix, blockKey } = this.props;
    this.setState({ anchorEl: null }, () => {
      onFix({ start, end, suggestion, blockKey });
    });
  };

  render() {
    const { start, word, children, classes, suggestions, messages: userMessages } = this.props;
    const { anchorEl } = this.state;

    let messages = userMessages ? userMessages : [`Spelling error: ${word}`];

    return (
      <Fragment>
        <span className={classes.root} onClick={this.handleClick}>
          {children}
        </span>
        <Popover
          id={word + start}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          placement="right"
          className={classes.popper}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
        >
          <List
            dense
            component="nav"
            subheader={<ListSubheader component="div">{messages.join('\n')}</ListSubheader>}
            className={classes.list}
          >
            {suggestions &&
              suggestions.map(s => (
                <ListItem button key={s} onClick={this.handleFix.bind(this, s)}>
                  <ListItemText primary={s} />
                </ListItem>
              ))}
          </List>
        </Popover>
      </Fragment>
    );
  }
}

export default withStyles(styles)(WordError);
