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
      updateCardOrder(obj, { source, destination, cardId }) {
        if (!destination) {
          return [];
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
          return [];
        }

        const sourceColumn = columns.find(c => c.id === source.droppableId);
        const destinationColumn = columns.find(c => c.id === destination.droppableId);
        const card = sourceColumn.cards.find(c => c.id === cardId);
        sourceColumn.cards.splice(source.index, 1);
        destinationColumn.cards.splice(destination.index, 0, card);
        sourceColumn.cards = sourceColumn.cards.map((card, index) => {
          card.index = index;
          return card;
        });

        if (source.droppableId === destination.droppableId) {
          // order cards in same column
          return columns;
        }

        // order cards in different columns
        destinationColumn.cards = destinationColumn.cards.map((card, index) => {
          card.index = index;
          return card;
        });

        return columns;
      },
      switchService(obj, { id }) {
        const service = services.find(s => s.id === id);
        service.enabled = !service.enabled;
        return service;
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
