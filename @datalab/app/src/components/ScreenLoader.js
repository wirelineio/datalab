import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from '@material-ui/core/Modal';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  progress: {
    margin: theme.spacing.unit * 2,
    outline: 'none'
  }
});

function Loader({ classes, ...other }) {
  return (
    <Modal className={classes.root} {...other}>
      <CircularProgress className={classes.progress} />
    </Modal>
  );
}

export default withStyles(styles)(Loader);
