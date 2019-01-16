//
// Copyright 2017 Wireline, Inc.
//

// Enable source map support.
// https://github.com/evanw/node-source-map-support#programmatic-usage
import 'source-map-support/register';
import hyperid from 'hyperid';

import Wireline from '@wirelineio/sdk';
import { concatenateTypeDefs, makeExecutableSchema } from 'graphql-tools';
import { graphql } from 'graphql';

import Store from '@wirelineio/store-client';

import SourceSchema from './schema.graphql';

const uuid = hyperid({
  fixedLength: true,
  urlSafe: true
});

const schema = makeExecutableSchema({
  // Schema types.
  typeDefs: concatenateTypeDefs([SourceSchema]),

  // http://dev.apollodata.com/tools/graphql-tools/resolvers.html
  resolvers: {
    Query: {
      async getAllRemoteOrganizations(obj, args, { store }) {
        return store.scan('organizations');
      },
      async getRemoteOrganization(obj, { id }, { store }) {
        return store.get(`organizations/${id}`);
      },
      async getAllRemoteContacts(obj, args, { store }) {
        return store.scan('contacts');
      },
      async getRemoteContact(obj, { id }, { store }) {
        return store.get(`contacts/${id}`);
      }
    },
    Mutation: {
      async createRemoteOrganization(obj, args, { store }) {
        const organization = Object.assign({}, args, { id: uuid() });
        await store.set(`organizations/${organization.id}`, organization);
        return organization;
      },
      async updateRemoteOrganization(obj, { id, ...args }, { store }) {
        let organization = await store.get(`organizations/${id}`);

        if (!organization) {
          return null;
        }

        organization = {
          ...organization,
          ...args
        };

        await store.set(`organizations/${id}`, organization);
        return organization;
      },
      async createRemoteContact(obj, args, { store }) {
        const contact = Object.assign({}, args, { id: uuid() });
        await store.set(`contacts/${contact.id}`, contact);
        return contact;
      },
      async updateRemoteContact(obj, { id, ...args }, { store }) {
        let contact = await store.get(`contacts/${id}`);

        if (!contact) {
          return null;
        }

        contact = {
          ...contact,
          ...args
        };

        await store.set(`contacts/${contact.id}`, contact);
        return contact;
      },
      async resetStore(obj, args, { store }) {
        await store.clear();
      }
    }
  }
});

const createStore = (context, opts) => {
  opts = _.assign({
    useAccessKeyInStake: false,
    useAccountIdInPartition: true,
  }, opts);

  const store = new Store(context, opts);
  
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
  gql: Wireline.exec(async (event, context, response) => {
    const { body } = event;
    const { query, variables } = typeof body === 'string' ? JSON.parse(body) : body;

    let queryRoot = {};
    const store = createStore(context, { bucket: 'datalab-contacts' });

    let queryContext = {
      store
    };

    const { errors, data } = await graphql(schema, query, queryRoot, queryContext, variables);
    response.send({ data, errors });
  })
};
