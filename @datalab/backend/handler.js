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
import { services, profiles } from './data';

const mapServices = ({ wrnServices, store }) => async services => {
  const { profiles } = await store.get('profiles');

  const serviceIds = Object.keys(wrnServices);
  let onlyFirst = false;

  if (!Array.isArray(services)) {
    services = [services];
    onlyFirst = true;
  }

  const profile = profiles[0]; // admin

  const result = services.map(s => {
    const id = serviceIds.find(id => id.includes(s.id));

    if (id) {
      s.url = wrnServices[id].endpoint;
    }

    s.enabled = !!profile.services.find(ps => ps.id === s.id && ps.enabled);

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
      async getAllServices(obj, args, { store, mapServices }) {
        const { services = [] } = await store.get('services');
        return mapServices(services);
      }
    },
    Mutation: {
      async switchService(obj, { id }, { store, mapServices }) {
        const [{ services }, { profiles }] = await Promise.all([store.get('services'), store.get('profiles')]);

        const profile = profiles[0]; // admin

        const service = profile.services.find(s => s.id === id);

        if (service) {
          service.enabled = !service.enabled;
        } else {
          profile.services.push({ id, enabled: true });
        }

        await store.set('profiles', profiles);

        return mapServices(services.find(s => s.id === id));
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
      mapServices: mapServices({ wrnServices: context.wireline.services, store }),
      store
    };

    if (!init) {
      const { profiles: oldProfiles } = await store.get('profiles');
      if (!oldProfiles) {
        await store.set('profiles', profiles);
      }
      await store.set('services', services);
      init = true;
    }

    const { errors, data } = await graphql(schema, query, queryRoot, queryContext, variables);
    response.send({ data, errors });
  })
};
