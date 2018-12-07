import gql from 'graphql-tag';

export const GET_ALL_ORGANIZATIONS = gql`
  query GetAllOrganizations {
    organizations: getAllOrganizations {
      id
      name
      url
      goals
      stage {
        id
        name
      }
      contacts {
        id
        name
        email
        phone
      }
    }
    stages: getAllStages {
      id
      name
    }
  }
`;
