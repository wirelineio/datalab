import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.error.dark,
    cursor: 'pointer',
    '& > *': {
      color: theme.palette.error.contrastText
    }
  }
});

class WordError extends Component {
  state = {
    open: false
  };

  handleTooltipClose = () => {
    this.setState({ open: false });
  };

  handleTooltipOpen = () => {
    this.setState({ open: true });
  };

  render() {
    const { title, children, classes } = this.props;
    const { open } = this.state;

    return (
      <ClickAwayListener onClickAway={this.handleTooltipClose}>
        <Tooltip
          PopperProps={{
            disablePortal: true
          }}
          onClose={this.handleTooltipClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={title}
        >
          <span className={classes.root} onClick={this.handleTooltipOpen}>
            {children}
          </span>
        </Tooltip>
      </ClickAwayListener>
    );
  }
}

export default withStyles(styles)(WordError);
