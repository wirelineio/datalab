import gql from 'graphql-tag';

export const FragmentStageFields = gql`
  fragment StageFields on Stage {
    id
    name
  }
`;

export const FragmentContactFields = gql`
  fragment ContactFields on Contact {
    id
    name
    email
    phone
    ref {
      id
      serviceId
    }
  }
`;

export const FragmentOrganizationFields = gql`
  fragment OrganizationFields on Organization {
    id
    name
    url
    goals
    stage {
      ...StageFields
    }
    contacts {
      ...ContactFields
    }
    ref {
      id
      serviceId
    }
  }
  ${FragmentStageFields}
  ${FragmentContactFields}
`;

export const GET_ALL_ORGANIZATIONS = gql`
  query GetAllOrganizations {
    organizations: getAllOrganizations {
      ...OrganizationFields
    }
    stages: getAllStages {
      ...StageFields
    }
  }
  ${FragmentOrganizationFields}
  ${FragmentStageFields}
`;

export const GET_ALL_STAGES = gql`
  query GetAllStages {
    stages: getAllStages {
      ...StageFields
    }
  }
  ${FragmentStageFields}
`;

export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($ref: InputRemoteReference!, $data: InputRemoteOrganization, $stageId: ID) {
    organization: createOrganization(ref: $ref, data: $data, stageId: $stageId) {
      ...OrganizationFields
    }
  }
  ${FragmentOrganizationFields}
`;
