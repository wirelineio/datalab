import gql from 'graphql-tag';

export const GET_ALL_REMOTE_CONTACTS = gql`
  query GetAllRemoteContacts {
    remoteContacts: getAllRemoteContacts {
      id
      name
      email
      phone
      _serviceId @service
      _serviceType @service
    }
  }
`;

export const GET_ALL_REMOTE_ORGANIZATIONS = gql`
  query GetAllRemoteOrganizations {
    remoteOrganizations: getAllRemoteOrganizations {
      id
      name
      _serviceId @service
      _serviceType @service
    }
  }
`;
