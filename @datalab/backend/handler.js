//
// Copyright 2017 Wireline, Inc.
//

// Enable source map support.
// https://github.com/evanw/node-source-map-support#programmatic-usage
import 'source-map-support/register';

import Wireline, { Registry, Compute, ClaimHelper } from '@wirelineio/sdk';
import Store from '@wirelineio/store-client';

import { concatenateTypeDefs, makeExecutableSchema } from 'graphql-tools';
import { graphql, GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

import * as Config from './config';
import SourceSchema from './schema.graphql';
import { query as queryUsers } from './resolvers/user';
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
    Query: { ...queryUsers, ...queryServices, ...queryOrganizations, ...queryContacts },
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

module.exports = {
  gql: Wireline.exec(async (event, context, response) => {
    const { body } = event;
    const { query, variables } = typeof body === 'string' ? JSON.parse(body) : body;
    let queryRoot = {};

    const claimHelper = new ClaimHelper(Config.IDM.resourceId, Config.IDM.attestUrl, Config.IDM.realm);

    const store = new Store(context);
    store.oldscan = store.scan;
    store.scan = async (key, opts) => {
      const result = await store.oldscan(key, opts);
      return result.map(r => r.value);
    };
    store.oldget = store.get;
    store.get = async (key, opts) => {
      const result = await store.oldget(key, opts);

      if (result[key] !== undefined) {
        return result[key];
      }

      return null;
    };

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
      claimHelper,
      context, // Needed to call claimHelper methods inside resolvers.
      store,
      registry,
      compute,
      wrnServices
    };

    const { errors, data } = await graphql(schema, query, queryRoot, queryContext, variables);

    if (errors) {
      const claimError = errors.find(e => e.originalError && 'ClaimRequiredError' === e.originalError.name);
      if (claimError) {
        const claimReq = claimError.originalError;
        claimReq.respond(event, context, response);
      } else {
        response.send({ errors });
      }
    } else {
      response.send({ data });
    }
  }),

  claimEnrollment: Wireline.exec(async (event, context, response) => {
    response.set('Content-Type', 'text/html');
    return `<!DOCTYPE>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>DataLab Idm Enrollment</title>
      <script id="wrn_resource_enrollment" type="application/json">
      {
        "resources": [{ 
          "id": "${Config.IDM.resourceId}",
          "claims": ${JSON.stringify(Object.values(Config.CLAIMS))}
        }],
        "idm": "${Config.IDM.attestUrl}"
      }
      </script>      
    </head>
    <body>
    </body>
    </html>
  `;
  })
};
