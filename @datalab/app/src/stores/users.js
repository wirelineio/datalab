//
// Copyright 2019 Wireline, Inc.
//

import gql from 'graphql-tag';

export const GET_CURRENT_USER = gql`
  query {
    user: getCurrentUser {
      userId
      claims {
        resource
        name
      }
    }
  }
`;
