//
// Copyright 2017 Wireline, Inc.
//

// Enable source map support.
// https://github.com/evanw/node-source-map-support#programmatic-usage
import 'source-map-support/register';

import Wireline from '@wirelineio/sdk';
import { concatenateTypeDefs, makeExecutableSchema } from 'graphql-tools';
import { graphql, GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

import SourceSchema from './schema.graphql';

let tasks = [
  {
    id: 'task-1',
    content: 'do something!',
    author: 'tincho',
    to: 'card-3',
    createdAt: new Date(),
    done: true,
    serviceId: 'service-2'
  },
  {
    id: 'task-2',
    content: 'do something more!',
    author: 'tincho',
    to: 'card-3',
    createdAt: new Date(),
    done: false,
    serviceId: 'service-2'
  }
];
let tasksIdx = 2;

const schema = makeExecutableSchema({
  // Schema types.
  typeDefs: concatenateTypeDefs([SourceSchema]),

  // http://dev.apollodata.com/tools/graphql-tools/resolvers.html
  resolvers: {
    Query: {
      getAllTasks() {
        return tasks;
      }
    },
    Mutation: {
      addTask(obj, { content, to }) {
        tasksIdx++;
        const task = {
          id: `task-${tasksIdx}`,
          content,
          to,
          author: 'tincho',
          createdAt: new Date(),
          done: false,
          serviceId: 'service-2'
        };
        tasks.push(task);
        return task;
      },
      deleteTask(obj, { id }) {
        tasks = tasks.filter(t => t.id !== id);
        return id;
      },
      toggleTask(obj, { id }) {
        const task = tasks.find(t => t.id === id);
        task.done = !task.done;
        return task;
      }
    },
    Date: new GraphQLScalarType({
      name: 'Date',
      description: 'Date custom scalar type',
      parseValue(value) {
        return new Date(value);
      },
      serialize(value) {
        return value.getTime();
      },
      parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
          return new Date(ast.value);
        }
        return null;
      }
    })
  }
});

module.exports = {
  gql: Wireline.exec(async (event, context, response) => {
    const { body } = event;
    const { query, variables } = typeof body === 'string' ? JSON.parse(body) : body;
    let queryRoot = {};
    let queryContext = {};

    const { errors, data } = await graphql(schema, query, queryRoot, queryContext, variables);
    response.send({ data, errors });
  })
};
