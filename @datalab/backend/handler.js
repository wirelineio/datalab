//
// Copyright 2017 Wireline, Inc.
//

// Enable source map support.
// https://github.com/evanw/node-source-map-support#programmatic-usage
import 'source-map-support/register';

import { Wireline, Registry, Compute, WalletAuthRequirement } from '@wirelineio/sdk';
import Store from '@wirelineio/store-client';

import { concatenateTypeDefs, makeExecutableSchema } from 'graphql-tools';
import { graphql, GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { services, profiles } from './data';

import SourceSchema from './schema.graphql';

import {
  mapProfiles,
  getAllServices,
  getAllEnabledServices,
  executeInService,
  query as queryServices,
  mutation as mutationServices
} from './resolvers/services';
import { query as queryOrganizations, mutation as mutationOrganizations } from './resolvers/organizations';
import { query as queryContacts, mutation as mutationContacts } from './resolvers/contacts';

import Organizations from './lib/organizations';

const schema = makeExecutableSchema({
  // Schema types.
  typeDefs: concatenateTypeDefs([SourceSchema]),

  // http://dev.apollodata.com/tools/graphql-tools/resolvers.html
  resolvers: {
    Query: { ...queryServices, ...queryOrganizations, ...queryContacts },
    Mutation: { ...mutationServices, ...mutationOrganizations, ...mutationContacts },
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

const WALLET_CLAIM = [
  {
    publickey: {
      attest: ['self'],
      relationship: 'datalab',
      required: true
    }
  }
];

const createStore = (context) => {
  const store = new Store(context, {
    useAccessKeyInStake: false,
    useAccountIdInPartition: true,
  });
  
  store.oldscan = store.scan;
  store.scan = async key => {
    const result = await store.oldscan(key);
    return result.map(r => r.value);
  };

  store.oldget = store.get;
  store.get = async (key, defaultTo) => {
    const result = await store.oldget(key);

    if (result[key] !== undefined) {
      return result[key];
    }

    return defaultTo === undefined ? null : defaultTo;
  };

  return store;
};

module.exports = {
  reset: Wireline.exec(async (event, context) => {
    const store = createStore(context);
    //TODO(telackey): This should be 'format' but we need an update
    //to the client, which is mysteriously missing it.
    await store.clear();
    await Promise.all(profiles.map(p => store.set(`profiles/${p.id}`, p)));
    await Promise.all(services.map(s => store.set(`services/${s.id}`, s)));
    return {};
  }, [new WalletAuthRequirement(WALLET_CLAIM)]),

  gql: Wireline.exec(async (event, context, response) => {
    const { body } = event;
    const { query, variables } = typeof body === 'string' ? JSON.parse(body) : body;
    let queryRoot = {};

    const store = createStore(context);

    const registry = new Registry({
      endpoint: Registry.getEndpoint(),
      accessKey: context.wireline.accessKey
    });
    const compute = new Compute({
      endpoint: Compute.getEndpoint(),
      accessKey: context.wireline.accessKey
    });

    const wrnServices = context.wireline.services;
    const _getAllServices = getAllServices({ registry, compute, wrnServices });
    const _getAllEnabledServices = getAllEnabledServices({ store, registry, compute, wrnServices });
    const _executeInService = executeInService(_getAllEnabledServices);

    let queryContext = {
      mapProfiles: mapProfiles(store),
      orgs: new Organizations({
        store,
        executeInService: _executeInService
      }),
      getAllServices: _getAllServices,
      getAllEnabledServices: _getAllEnabledServices,
      executeInService: _executeInService,
      store,
      registry,
      compute,
      wrnServices
    };

    const { errors, data } = await graphql(schema, query, queryRoot, queryContext, variables);
    response.send({ data, errors });
  }, [new WalletAuthRequirement(WALLET_CLAIM)])
};
