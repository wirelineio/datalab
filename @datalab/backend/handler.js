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

import { columns, services } from './data';

const schema = makeExecutableSchema({
  // Schema types.
  typeDefs: concatenateTypeDefs([SourceSchema]),

  // http://dev.apollodata.com/tools/graphql-tools/resolvers.html
  resolvers: {
    Query: {
      getAllColumns() {
        return columns;
      },
      getAllServices() {
        return services;
      }
    },
    Mutation: {
      //addTask(obj, { content, to }) {

      //},
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
