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
import hyperid from 'hyperid';

import SourceSchema from './schema.graphql';

const uuid = hyperid({
  fixedLength: true,
  urlSafe: true
});

const withStage = store => async record => {
  const { stages = [] } = await store.get('stages');
  if (Array.isArray(record)) {
    return record.map(r => {
      r.stage = stages.find(stage => stage.id === r.stageId);
      return r;
    });
  }
  record.stage = stages.find(stage => stage.id === record.stageId);
  return record;
};

const schema = makeExecutableSchema({
  // Schema types.
  typeDefs: concatenateTypeDefs([SourceSchema]),

  // http://dev.apollodata.com/tools/graphql-tools/resolvers.html
  resolvers: {
    Query: {
      async getAllPartners(obj, args, { store, withStage }) {
        const { partners = [] } = await store.get('partners');
        return withStage(partners);
      },
      async getAllStages(obj, args, { store }) {
        const { stages = [] } = await store.get('stages');
        return stages;
      }
    },
    Mutation: {
      async createPartner(obj, args, { store, withStage }) {
        const { partners = [] } = await store.get('partners');
        const partner = Object.assign({}, args, { id: uuid() });
        partners.push(partner);
        await store.set('partners', partners);
        return withStage(partner);
      },
      async updatePartner(obj, { id, ...args }, { store, withStage }) {
        const { partners = [] } = await store.get('partners');
        const idx = partners.findIndex(p => p.id === id);

        if (idx === -1) {
          return null;
        }

        partners[idx] = {
          ...partners[idx],
          ...args
        };

        await store.set('partners', partners);

        return withStage(partners[idx]);
      },
      async deletePartner(obj, { id }, { store }) {
        let { partners = [] } = await store.get('partners');
        partners = partners.filter(p => p.id !== id);
        await store.set('partners', partners);
        return id;
      },
      async createStage(obj, { name }, { store }) {
        const { stages = [] } = await store.get('stages');
        const stage = { id: uuid(), name };
        stages.push(stage);
        await store.set('stages', stages);
        return stage;
      },
      async deleteStage(obj, { id }, { store }) {
        let { stages = [] } = await store.get('stages');

        stages = stages.filter(s => s.id !== id);

        await store.set('stages', stages);

        return id;
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

    const store = new Store(context, { bucket: 'dl-contacts' });
    let queryContext = {
      store,
      withStage: withStage(store)
    };

    const { errors, data } = await graphql(schema, query, queryRoot, queryContext, variables);
    response.send({ data, errors });
  })
};
