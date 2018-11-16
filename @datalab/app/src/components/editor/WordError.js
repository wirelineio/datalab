import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const styles = theme => ({
  root: {
    cursor: 'pointer',
    borderBottom: `2px solid ${theme.palette.error.dark}`
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
    const { messages, children, classes } = this.props;
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
          title={messages.join('\n')}
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
