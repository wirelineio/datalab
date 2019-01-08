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

export const UPDATE_ORGANIZATION = gql`
  mutation UpdateOrganization($id: ID!, $data: InputRemoteOrganization, $stageId: ID) {
    organization: updateOrganization(id: $id, data: $data, stageId: $stageId) {
      ...OrganizationFields
    }
  }
  ${FragmentOrganizationFields}
`;

export const updateOrganizationOptimistic = ({ organizations, stages }, variables) => {
  const { id, stageId, ...args } = variables;

  const organization = organizations.find(p => p.id === id);

  const newOrganization = {
    stage: null,
    ...args
  };

  if (stageId) {
    const stage = stages.find(a => a.id === stageId);
    newOrganization.stage = stage ? stage : null;
  }

  return {
    organization: {
      ...organization,
      ...newOrganization
    }
  };
};
