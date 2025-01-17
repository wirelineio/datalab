# Contacts Service

## Datalab Contacts Implementation

- interface: `"wire://datalab/contacts"`
- endpoint: `POST /gql`
- schema:
  ```gql
  #
  # Types
  #
  type RemoteOrganization {
    id: ID!
    name: String!
    url: String
    goals: String
    contacts: [RemoteContact]
  }

  type RemoteContact {
    id: ID!
    name: String!
    email: String
    phone: String
  }

  #
  # Root Query
  #

  type Query {
    getAllRemoteOrganizations: [RemoteOrganization!]

    getRemoteOrganization(id: ID!): RemoteOrganization

    getAllRemoteContacts: [RemoteContact!]

    getRemoteContact(id: ID!): RemoteContact
  }

  type Mutation {
    createRemoteOrganization(name: String!, url: String, goals: String): RemoteOrganization

    updateRemoteOrganization(id: ID!, name: String, url: String, goals: String): RemoteOrganization

    createRemoteContact(name: String, email: String, phone: String): RemoteContact

    updateRemoteContact(id: ID!, name: String, email: String, phone: String): RemoteContact

    deleteContact(id: ID!): ID
  }

  #
  # Schema
  #
  schema {
    query: Query
    mutation: Mutation
  }
  ```
