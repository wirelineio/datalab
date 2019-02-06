//
// Copyright 2019 Wireline, Inc.
//

import React from 'react';
import { compose } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import withCurrentUser from './CurrentUser';

const styles = () => ({
  root: {
    height: `100vh`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

class Login extends React.Component {
  render() {
    const {
      location: { state: { errors, from = '/' } = {} },
      profile,
      classes
    } = this.props;
    return (
      <React.Fragment>
        {profile && !errors && <Redirect to={from} />}
        {!profile && (
          <div className={classes.root}>
            <Typography variant="h4" gutterBottom>
              You are not Signed In!
            </Typography>
            {errors && !!errors.length && (
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Errors
                </Typography>
                {errors.map((error, idx) => (
                  <Typography key={idx} variant="h6" color="error">
                    {error.message}
                  </Typography>
                ))}
              </React.Fragment>
            )}
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default compose(
  withCurrentUser,
  withStyles(styles)
)(Login);
