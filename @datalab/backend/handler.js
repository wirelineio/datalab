//
// Copyright 2017 Wireline, Inc.
//

// Enable source map support.
// https://github.com/evanw/node-source-map-support#programmatic-usage
import 'source-map-support/register';

import Wireline from '@wirelineio/sdk';
import Store from '@wirelineio/store-client';

import { concatenateTypeDefs, makeExecutableSchema } from 'graphql-tools';
import { graphql, GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

import SourceSchema from './schema.graphql';
import { columns, services } from './data';

const mapServiceUrl = wrnServices => services => {
  const serviceIds = Object.keys(wrnServices);
  let onlyFirst = false;

  if (!Array.isArray(services)) {
    services = [services];
    onlyFirst = true;
  }

  const result = services.map(s => {
    const id = serviceIds.find(id => id.includes(s.id));

    if (id) {
      s.url = wrnServices[id].endpoint;
    }

    return s;
  });

  if (onlyFirst) {
    return result[0];
  }

  return result;
};

const schema = makeExecutableSchema({
  // Schema types.
  typeDefs: concatenateTypeDefs([SourceSchema]),

  // http://dev.apollodata.com/tools/graphql-tools/resolvers.html
  resolvers: {
    Query: {
      async getAllColumns(obj, args, { store }) {
        const { columns = [] } = await store.get('columns');
        return columns;
      },
      async getAllServices(obj, args, { store, mapServiceUrl }) {
        const { services = [] } = await store.get('services');
        return mapServiceUrl(services);
      }
    },
    Mutation: {
      async updateCardOrder(obj, { source, destination, cardId }, { store }) {
        if (!destination) {
          return [];
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
          return [];
        }

        const { columns = [] } = await store.get('columns');
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

        await store.set('columns', columns);

        return columns;
      },
      async switchService(obj, { id }, { store, mapServiceUrl }) {
        const { services = [] } = await store.get('services');

        const service = services.find(s => s.id === id);
        service.enabled = !service.enabled;

        await store.set('services', services);

        return mapServiceUrl(service);
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

let init = false;

module.exports = {
  gql: Wireline.exec(async (event, context, response) => {
    const { body } = event;
    const { query, variables } = typeof body === 'string' ? JSON.parse(body) : body;
    let queryRoot = {};

    const store = new Store(context);
    let queryContext = {
      mapServiceUrl: mapServiceUrl(context.wireline.services),
      store
    };

    if (!init) {
      const { seeded } = await store.get('seeded');
      //if (!seeded) {
      await Promise.all([store.set('columns', columns), store.set('services', services)]);
      //}
      await store.set('seeded', true);
      init = true;
    }

    const { errors, data } = await graphql(schema, query, queryRoot, queryContext, variables);
    response.send({ data, errors });
  })
};
