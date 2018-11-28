# Contacts Service

## Datalab Contacts Implementation

- interface: `"wire://datalab/contacts"`
- endpoint: `POST /gql`
- schema:
  ```gql
  #
  # Types
  #
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

    getAllContacts: [RemoteContact!]

    getContact(id: ID!): RemoteContact

    search(value: String!): [RemoteContact!]

  }

  #
  # Schema
  #
  schema {
    query: Query
  }
  ```
