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
      serviceId
    }
  }
`;

export const TOGGLE_TASK = gql`
  mutation ToggleTask($id: ID!) {
    toggleTask(id: $id) {
      id
      done
    }
  }
`;
