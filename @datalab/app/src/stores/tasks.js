import gql from 'graphql-tag';

export const GET_TASKS = gql`
  {
    tasks: getAllTasks {
      id
      content
      author
      to
      createdAt
      done
    }
  }
`;
