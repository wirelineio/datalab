import gql from 'graphql-tag';

export const GET_ALL_PARTNERS = gql`
  query GetAllPartners {
    partners: getAllPartners {
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
