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

const uuid = hyperid();

const schema = makeExecutableSchema({
  // Schema types.
  typeDefs: concatenateTypeDefs([SourceSchema]),

  // http://dev.apollodata.com/tools/graphql-tools/resolvers.html
  resolvers: {
    Query: {
      async getAllContacts(obj, args, { store }) {
        const [{ contacts = [] }, { companies = [] }, { areas = [] }] = await Promise.all([
          store.get('contacts'),
          store.get('companies'),
          store.get('areas')
        ]);
        contacts.sort((a, b) => a.createdAt - b.createdAt);
        return contacts.map(c => {
          c.company = companies.find(comp => comp.id === c.companyId);
          c.area = areas.find(a => a.id === c.areaId);
          return c;
        });
      },
      async getContact(obj, { id }, { store }) {
        const [{ contacts = [] }, { companies = [] }, { areas = [] }] = await Promise.all([
          store.get('contacts'),
          store.get('companies'),
          store.get('areas')
        ]);
        const contact = contacts.find(c => c.id === id);
        contact.company = companies.find(comp => comp.id === contact.companyId);
        contact.area = areas.find(a => a.id === contact.areaId);
        return contact;
      },
      async getAllCompanies(obj, args, { store }) {
        const { companies = [] } = await store.get('companies');
        return companies;
      },
      async getAllAreas(obj, args, { store }) {
        const { areas = [] } = await store.get('areas');
        return areas;
      }
    },
    Mutation: {
      async addContact(obj, args, { store }) {
        const { contacts = [] } = await store.get('contacts');
        const contact = Object.assing({ id: uuid() }, args);
        contacts.push(contact);
        await store.set('contacts', contacts);
        return contact;
      },
      async updateContact(obj, args, { store }) {
        const { id } = args;

        const { contacts = [] } = await store.get('contacts');
        const idx = contacts.findIndex(c => c.id === id);
        const contact = contacts[idx];

        if (!contact) {
          return null;
        }

        Object.keys(args).forEach(prop => {
          if (prop !== 'id') {
            contact[prop] = args[prop];
          }
        });

        await store.set('contacts', contacts);
        return contact;
      },
      async deleteContact(obj, { id }, { store }) {
        const { contacts = [] } = await store.get('contacts');
        const contact = contacts.find(c => c.id === id);

        if (!contact) {
          return null;
        }

        await store.set('contacts', contacts.filter(c => c.id !== id));
        return contact;
      },
      async addCompany(obj, { name }, { store }) {
        const { companies = [] } = await store.get('companies');
        const company = { id: uuid(), name };
        companies.push(company);
        await store.set('companies', companies);
        return company;
      },
      async addArea(obj, { name }, { store }) {
        const { areas = [] } = await store.get('areas');
        const area = { id: uuid(), name };
        areas.push(area);
        await store.set('areas', areas);
        return area;
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
      store
    };

    const { errors, data } = await graphql(schema, query, queryRoot, queryContext, variables);
    response.send({ data, errors });
  })
};
