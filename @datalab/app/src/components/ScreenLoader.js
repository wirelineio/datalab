import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    margin: theme.spacing.unit * 0,
    outline: 'none',
    zIndex: 3001,
    backgroundColor: 'transparent'
  },
  bar: {
    backgroundColor: 'rgba(0,0,0,.3)'
  }
});

function Loader({ classes, open }) {
  return open ? <LinearProgress className={classes.progress} classes={{ bar1Indeterminate: classes.bar }} /> : null;
}

export default withStyles(styles)(Loader);
