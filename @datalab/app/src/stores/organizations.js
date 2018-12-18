import gql from 'graphql-tag';
import { produce } from 'immer';

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

export const CREATE_CONTACT = gql`
  mutation CreateContact($ref: InputRemoteReference!, $data: InputRemoteContact) {
    contact: createContact(ref: $ref, data: $data) {
      ...ContactFields
    }
  }
  ${FragmentContactFields}
`;

export const UPDATE_CONTACT = gql`
  mutation UpdateContact($id: ID!, $data: InputRemoteContact!) {
    contact: updateContact(id: $id, data: $data) {
      ...ContactFields
    }
  }
  ${FragmentContactFields}
`;

export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($name: String!, $url: String, $goals: String, $stageId: ID) {
    organization: createOrganization(name: $name, url: $url, goals: $goals, stageId: $stageId) {
      ...OrganizationFields
    }
  }
  ${FragmentOrganizationFields}
`;

export const UPDATE_ORGANIZATION = gql`
  mutation UpdateOrganization($id: ID!, $name: String, $url: String, $goals: String, $stageId: ID) {
    organization: updateOrganization(id: $id, name: $name, url: $url, goals: $goals, stageId: $stageId) {
      ...OrganizationFields
    }
  }
  ${FragmentOrganizationFields}
`;

export const ADD_CONTACT_TO_ORGANIZATION = gql`
  mutation AddContactToOrganization($id: ID!, $contactId: ID!) {
    organization: addContactToOrganization(id: $id, contactId: $contactId) {
      ...OrganizationFields
    }
  }
  ${FragmentOrganizationFields}
`;

export const DELETE_CONTACT_FROM_ORGANIZATION = gql`
  mutation DeleteContactFromOrganization($id: ID!, $contactId: ID!) {
    organization: deleteContactFromOrganization(id: $id, contactId: $contactId) {
      ...OrganizationFields
    }
  }
  ${FragmentOrganizationFields}
`;

export const MOVE_CONTACT_TO_ORGANIZATION = gql`
  mutation MoveContactToOrganization($id: ID!, $toOrganization: ID!, $contactId: ID!) {
    organizations: moveContactToOrganization(id: $id, toOrganization: $toOrganization, contactId: $contactId) {
      ...OrganizationFields
    }
  }
  ${FragmentOrganizationFields}
`;

export const DELETE_ORGANIZATION = gql`
  mutation DeleteOrganization($id: ID!) {
    deleteOrganization(id: $id)
  }
`;

export const CREATE_STAGE = gql`
  mutation CreateStage($name: String!) {
    stage: createStage(name: $name) {
      ...StageFields
    }
  }
  ${FragmentStageFields}
`;

export const UPDATE_STAGE = gql`
  mutation UpdateStage($id: ID!, $name: String!) {
    stage: updateStage(id: $id, name: $name) {
      ...StageFields
    }
  }
  ${FragmentStageFields}
`;

export const DELETE_STAGE = gql`
  mutation DeleteStage($id: ID!) {
    deleteStage(id: $id)
  }
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

export const updateContactToOrganizationOtimistic = ({ organizations }, variables) => {
  const { id, toOrganization, contactId } = variables;

  const mutate = produce(organizations => {
    const oldOrganization = organizations.find(p => p.id === id);
    const contact = oldOrganization.contacts.find(c => c.id === contactId);

    // delete old
    oldOrganization.contacts = oldOrganization.contacts.filter(c => c.id !== contactId);

    const newOrganization = organizations.find(
      p => p.id === toOrganization && !p.contacts.find(c => c.id === contactId)
    );

    // check if the contact is not already there
    if (newOrganization) {
      newOrganization.contacts = [...newOrganization.contacts, contact];
    }
  });

  return {
    organizations: mutate(organizations)
  };
};

export const deleteContactFromOrganizationOtimistic = ({ organizations }, variables) => {
  const { id, contactId } = variables;
  const organization = organizations.find(o => o.id === id);

  const mutate = produce(organization => {
    organization.contacts = organization.contacts.filter(c => c.id !== contactId);
    return organization;
  });

  return { organization: mutate(organization) };
};
