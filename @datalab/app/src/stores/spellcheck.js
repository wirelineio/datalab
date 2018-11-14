import gql from 'graphql-tag';

export const SPELLCHECK = gql`
  query Check($value: String!) {
    errors: check(value: $value) {
      message
      start
      end
    }
  }
`;
