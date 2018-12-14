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
      async getAllOrganizations(obj, args, { store }) {
        const { organizations = [] } = await store.get('organizations');
        return organizations;
      },
      async getOrganization(obj, { id }, { store }) {
        const { organizations = [] } = await store.get('organizations');
        return organizations.find(o => o.id === id);
      },
      async getAllContacts(obj, args, { store }) {
        const { contacts = [] } = await store.get('contacts');
        return contacts;
      },
      async getContact(obj, { id }, { store }) {
        const { contacts = [] } = await store.get('contacts');
        return contacts.find(c => c.id === id);
      }
    },
    Mutation: {
      async createOrganization(obj, args, { store }) {
        const { organizations = [] } = await store.get('organizations');

        const organization = Object.assign({}, args, { id: uuid() });
        organizations.push(organization);
        await store.set('organizations', organizations);

        return organization;
      },
      async updateOrganization(obj, { id, ...args }, { store }) {
        const { organizations = [] } = await store.get('organizations');
        const idx = organizations.findIndex(o => o.id === id);

        if (idx === -1) {
          return null;
        }

        organizations[idx] = {
          ...organizations[idx],
          ...args
        };

        await store.set('organizations', organizations);
        return organizations[idx];
      },
      async createContact(obj, args, { store }) {
        const { contacts = [] } = await store.get('contacts');

        const contact = Object.assign({}, args, { id: uuid() });
        contacts.push(contact);
        await store.set('contacts', contacts);

        return contact;
      },
      async updateContact(obj, { id, ...args }, { store }) {
        const { contacts = [] } = await store.get('contacts');
        const idx = contacts.findIndex(c => c.id === id);

        if (idx === -1) {
          return null;
        }

        contacts[idx] = {
          ...contacts[idx],
          ...args
        };

        await store.set('contacts', contacts);
        return contacts[idx];
      }
    }
  }
});

module.exports = {
  gql: Wireline.exec(async (event, context, response) => {
    const { body } = event;
    const { query, variables } = typeof body === 'string' ? JSON.parse(body) : body;

    let queryRoot = {};
    const store = new Store(context, { bucket: 'datalab-contacts' });
    let queryContext = {
      store
    };

    //await store.set('contacts', [
    //{ id: 'contact-1', name: 'Martin Acosta', email: 'martin@geut.com', phone: '33333' },
    //{ id: 'contact-2', name: 'Esteban Primost', email: 'esteban@geut.com', phone: '2222' },
    //{ id: 'contact-3', name: 'Maximiliano Fierro', email: 'max@geut.com', phone: '5555' }
    //]);

    const { errors, data } = await graphql(schema, query, queryRoot, queryContext, variables);
    response.send({ data, errors });
  })
};
