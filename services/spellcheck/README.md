# Spellcheck Dictionary Service

## Datalab Spellcheck Implementation

- interface: `"wire://datalab/spellcheck"`
- endpoint: `POST /gql`
- schema:
  ```gql
  #
  # Types
  #
  type SpellcheckError {
    messages: [String!]
    suggestions: [String!]
    word: String!
  }

  #
  # Root Query
  #
  type Query {
    check(value: String!): [SpellcheckError!]
  }

  #
  # Schema
  #
  schema {
    query: Query
  }
  ```
