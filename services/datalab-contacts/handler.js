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
        return store.scan(null, { bucket: 'organizations' });
      },
      async getRemoteOrganization(obj, { id }, { store }) {
        return store.get(id, { bucket: 'organizations' });
      },
      async getAllRemoteContacts(obj, args, { store }) {
        return store.scan(null, { bucket: 'contacts' });
      },
      async getRemoteContact(obj, { id }, { store }) {
        return store.get(id, { bucket: 'contacts' });
      }
    },
    Mutation: {
      async createRemoteOrganization(obj, args, { store }) {
        const organization = Object.assign({}, args, { id: uuid() });
        await store.set(organization.id, organization, { bucket: 'organizations' });
        return organization;
      },
      async updateRemoteOrganization(obj, { id, ...args }, { store }) {
        let organization = await store.get(id, { bucket: 'organizations' });

        if (!organization) {
          return null;
        }

        organization = {
          ...organization,
          ...args
        };

        await store.set(id, organization, { bucket: 'organizations' });
        return organization;
      },
      async createRemoteContact(obj, args, { store }) {
        const contact = Object.assign({}, args, { id: uuid() });
        await store.set(contact.id, contact, { bucket: 'contacts' });
        return contact;
      },
      async updateRemoteContact(obj, { id, ...args }, { store }) {
        let contact = await store.get(id, { bucket: 'contacts' });

        if (!contact) {
          return null;
        }

        contact = {
          ...contact,
          ...args
        };

        await store.set(contact.id, contact, { bucket: 'contacts' });
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
  store.scan = async (...args) => {
    const result = await store.oldscan(...args);
    return result.map(r => r.value);
  };
  store.oldget = store.get;
  store.get = async (key, ...args) => {
    const result = await store.oldget(key, ...args);

    if (result[key] !== undefined) {
      return result[key];
    }

    return null;
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
