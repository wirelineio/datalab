//
// Copyright 2019 Wireline, Inc.
//

import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import withCurrentUser from '../containers/CurrentUser';

class PrivateRoute extends React.Component {
  render() {
    const { component, render, profile, loadingProfile, error, checkClaims, claims, ...rest } = this.props;
    const RouteComponent = component || render;
    if (loadingProfile) return null;

    return (
      <Route
        {...rest}
        render={props => {
          const { location } = props;

          if (!profile) {
            return (
              <Redirect to={{ pathname: '/login', state: { from: location, errors: [...error.graphQLErrors] } }} />
            );
          }

          return !claims || checkClaims(claims) ? (
            <RouteComponent {...rest} {...props} profile={profile} checkClaims={checkClaims} />
          ) : null;
        }}
      />
    );
  }
}

export default withCurrentUser(PrivateRoute);
