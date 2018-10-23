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

const messages = [
  { id: 'message-1', content: 'hii!', from: 'tincho', to: 'card-2', createdAt: new Date() },
  { id: 'message-2', content: 'how are you?', from: 'tincho', to: 'card-2', createdAt: new Date() }
];
let messageIdx = 2;

const schema = makeExecutableSchema({
  // Schema types.
  typeDefs: concatenateTypeDefs([SourceSchema]),

  // http://dev.apollodata.com/tools/graphql-tools/resolvers.html
  resolvers: {
    Query: {
      getAllMessages() {
        const list = messages.slice();
        list.sort((a, b) => a.createdAt - b.createdAt);
        return list;
      }
    },
    Mutation: {
      sendMessage(obj, { content, to }) {
        messageIdx++;
        const message = { id: `message-${messageIdx}`, content, from: 'tincho', to, createdAt: new Date() };
        messages.push(message);
        return message;
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
