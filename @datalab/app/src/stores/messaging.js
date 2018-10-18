import gql from 'graphql-tag';

export const GET_MESSAGES = gql`
  {
    messages: getAllMessages {
      id
      content
      from
      to
      createdAt
    }
  }
`;
