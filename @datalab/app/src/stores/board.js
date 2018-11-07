import gql from 'graphql-tag';

export const GET_SERVICES = gql`
  {
    services: getAllServices {
      id
      name
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

export const getType = service => service.id.split('-')[1];
