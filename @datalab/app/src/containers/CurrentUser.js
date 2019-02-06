//
// Copyright 2019 Wireline, Inc.
//

import React from 'react';
import { compose, graphql } from 'react-apollo';
import { GET_CURRENT_USER } from '../stores/users';

const hasClaims = (userClaims = [], claims) => {
  return userClaims.find(userClaim =>
    claims.find(claim => {
      const [resource, name] = claim.toLowerCase().split(':');
      return userClaim.resource.toLowerCase() === resource && userClaim.name.toLowerCase() === name;
    })
  );
};

export default WrappedComponent => {
  return compose(
    graphql(GET_CURRENT_USER, {
      props({ data: { user, loading, error } }) {
        return {
          user: user, // && { ...user, claims: [{ resource: 'idm', name: 'canWrite' }] },
          loadingProfile: loading,
          error
        };
      }
    })
  )(
    class WithCurrentUser extends React.Component {
      userHasClaims = user => claims => hasClaims(user.claims, claims);
      render() {
        const { user, ...props } = this.props;
        return <WrappedComponent {...props} checkClaims={this.userHasClaims(user)} profile={user} />;
      }
    }
  );
};
