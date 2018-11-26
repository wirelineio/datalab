//
// Copyright 2017 Wireline, Inc.
//

// Enable source map support.
// https://github.com/evanw/node-source-map-support#programmatic-usage
import 'source-map-support/register';

import Wireline, { Registry, Compute } from '@wirelineio/sdk';
import Store from '@wirelineio/store-client';

import { concatenateTypeDefs, makeExecutableSchema } from 'graphql-tools';
import { graphql, GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

import SourceSchema from './schema.graphql';

import { initServices, mapServices, query as queryServices, mutation as mutationServices } from './resolvers/services';
import { addRelationsToPartner, query as queryOrgs, mutation as mutationOrgs } from './resolvers/orgs';

const schema = makeExecutableSchema({
  // Schema types.
  typeDefs: concatenateTypeDefs([SourceSchema]),

  // http://dev.apollodata.com/tools/graphql-tools/resolvers.html
  resolvers: {
    Query: { ...queryServices, ...queryOrgs },
    Mutation: { ...mutationServices, ...mutationOrgs },
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

    const store = new Store(context);
    let queryContext = {
      mapServices: mapServices({ wrnServices: context.wireline.services, store }),
      addRelationsToPartner: addRelationsToPartner(store),
      store,
      registry: new Registry({
        endpoint: Registry.getEndpoint(),
        accessKey: context.wireline.accessKey
      }),
      compute: new Compute({
        endpoint: Compute.getEndpoint(),
        accessKey: context.wireline.accessKey
      })
    };

    await initServices(store);

    const { errors, data } = await graphql(schema, query, queryRoot, queryContext, variables);
    response.send({ data, errors });
  })
};
