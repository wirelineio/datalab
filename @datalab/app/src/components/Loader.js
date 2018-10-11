import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';

const styles = theme => ({
  root: {
    margin: theme.spacing.unit,
    position: 'relative'
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
    zIndex: 1001
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1000
  }
});

const InnerButtonLoader = ({ loading, children, classes, size = 24 }) => {
  return (
    <div className={classes.root}>
      {React.Children.map(children, component => React.cloneElement(component, { disabled: loading }))}
      {loading && <CircularProgress size={size} className={classes.buttonProgress} />}
    </div>
  );
};

const InnerContentLoader = ({ loading, children, classes, size = 24 }) => {
  return (
    <div className={classes.root}>
      {loading && (
        <Fragment>
          <div className={classes.overlay} />
          <CircularProgress size={size} className={classes.buttonProgress} />
        </Fragment>
      )}
      {children}
    </div>
  );
};

export const ButtonLoader = withStyles(styles)(InnerButtonLoader);
export const ContentLoader = withStyles(styles)(InnerContentLoader);
