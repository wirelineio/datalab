import React, { Component, Fragment } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const styles = theme => ({
  root: {
    cursor: 'pointer',
    borderBottom: `2px solid ${theme.palette.error.dark}`
  },
  paper: {
    maxWidth: 400,
    overflow: 'auto'
  },
  popper: {
    zIndex: 1,
    '&[x-placement*="bottom"] $arrow': {
      top: 0,
      left: 0,
      marginTop: '-0.9em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '0 1em 1em 1em',
        borderColor: `transparent transparent ${theme.palette.common.white} transparent`
      }
    },
    '&[x-placement*="top"] $arrow': {
      bottom: 0,
      left: 0,
      marginBottom: '-0.9em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '1em 1em 0 1em',
        borderColor: `${theme.palette.common.white} transparent transparent transparent`
      }
    },
    '&[x-placement*="right"] $arrow': {
      left: 0,
      marginLeft: '-0.9em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 1em 1em 0',
        borderColor: `transparent ${theme.palette.common.white} transparent transparent`
      }
    },
    '&[x-placement*="left"] $arrow': {
      right: 0,
      marginRight: '-0.9em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 0 1em 1em',
        borderColor: `transparent transparent transparent ${theme.palette.common.white}`
      }
    }
  },
  arrow: {
    position: 'absolute',
    fontSize: 7,
    width: '3em',
    height: '3em',
    '&::before': {
      content: '""',
      margin: 'auto',
      display: 'block',
      width: 0,
      height: 0,
      borderStyle: 'solid'
    }
  }
});

class WordError extends Component {
  state = {
    arrowRef: null,
    open: false
  };

  handleClick = event => {
    const { currentTarget } = event;
    this.setState(state => ({
      anchorEl: currentTarget,
      open: !state.open
    }));
  };

  handleArrowRef = node => {
    this.setState({
      arrowRef: node
    });
  };

  handleFix = () => {
    console.log('fix');
  };

  render() {
    const { word, children, classes, suggestions, messages: userMessages } = this.props;
    const { open, arrowRef } = this.state;

    let messages = userMessages ? userMessages : [`Spelling error: ${word}`];

    return (
      <ClickAwayListener onClickAway={this.handleClick}>
        <Fragment>
          <span
            className={classes.root}
            onClick={this.handleClick}
            ref={node => {
              this.anchorEl = node;
            }}
          >
            {children}
          </span>
          <Popper
            id={word}
            open={open}
            anchorEl={this.anchorEl}
            placement="bottom"
            disablePortal={true}
            className={classes.popper}
            modifiers={{
              arrow: {
                enabled: true,
                element: arrowRef
              }
            }}
          >
            <span className={classes.arrow} ref={this.handleArrowRef} />
            <Paper className={classes.paper}>
              {suggestions && (
                <List dense component="nav" subheader={<ListSubheader component="div">{messages.join('\n')}</ListSubheader>}>
                  {suggestions.map(s => (
                    <ListItem button key={s} onClick={this.handleFix(this, s)}>
                      <ListItemText primary={s} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Popper>
        </Fragment>
      </ClickAwayListener>
    );
  }
}

export default withStyles(styles)(WordError);
