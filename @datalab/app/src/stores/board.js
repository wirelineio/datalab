import gql from 'graphql-tag';

export const GET_SERVICES = gql`
  {
    services: getAllServices {
      id
      name
      type
      description
      enabled
      url
    }
  }
`;

export const SWITCH_SERVICE = gql`
  mutation SwitchService($id: ID!) {
    switchService(id: $id) {
      id
      enabled
    }
  }
`;
