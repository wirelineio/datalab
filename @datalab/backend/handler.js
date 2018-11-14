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
import { services } from './data';

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
      async getAllServices(obj, args, { store, mapServiceUrl }) {
        const { services = [] } = await store.get('services');
        return mapServiceUrl(services);
      }
    },
    Mutation: {
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
      // const { seeded } = await store.get('seeded');
      //if (!seeded) {
      console.log(services);
      await store.set('services', services);
      //}
      await store.set('seeded', true);
      init = true;
    }

    const { errors, data } = await graphql(schema, query, queryRoot, queryContext, variables);
    response.send({ data, errors });
  })
};
