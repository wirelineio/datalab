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

const addRelationData = store => async contacts => {
  const [{ companies = [] }, { stages = [] }] = await Promise.all([store.get('companies'), store.get('stages')]);
  if (Array.isArray(contacts)) {
    return contacts.map(c => {
      c.company = companies.find(comp => comp.id === c.companyId);
      c.stage = stages.find(stage => stage.id === c.stageId);
      return c;
    });
  }
  contacts.company = companies.find(comp => comp.id === contacts.companyId);
  contacts.stage = stages.find(stage => stage.id === contacts.stageId);
  return contacts;
};

const schema = makeExecutableSchema({
  // Schema types.
  typeDefs: concatenateTypeDefs([SourceSchema]),

  // http://dev.apollodata.com/tools/graphql-tools/resolvers.html
  resolvers: {
    Query: {
      async getAllContacts(obj, args, { store, addRelationData }) {
        const { contacts = [] } = await store.get('contacts');
        contacts.sort((a, b) => a.createdAt - b.createdAt);
        return addRelationData(contacts);
      },
      async getContact(obj, { id }, { store, addRelationData }) {
        const { contacts = [] } = await store.get('contacts');
        const contact = contacts.find(c => c.id === id);
        return addRelationData(contact);
      },
      async getAllCompanies(obj, args, { store }) {
        const { companies = [] } = await store.get('companies');
        return companies;
      },
      async getAllStages(obj, args, { store }) {
        const { stages = [] } = await store.get('stages');
        return stages;
      }
    },
    Mutation: {
      async createContact(obj, args, { store, addRelationData }) {
        const { contacts = [] } = await store.get('contacts');
        const contact = Object.assign({}, args, { id: uuid(), createdAt: new Date() });
        contacts.push(contact);
        await store.set('contacts', contacts);
        return addRelationData(contact);
      },
      async updateContact(obj, args, { store, addRelationData }) {
        const { contacts = [] } = await store.get('contacts');
        const { id } = args;

        const contact = contacts.find(c => c.id === id);

        if (!contact) {
          return null;
        }
        Object.keys(args).forEach(prop => {
          contact[prop] = args[prop];
        });

        await store.set('contacts', contacts);
        return addRelationData(contact);
      },
      async updateMultipleContacts(obj, args, { store, addRelationData }) {
        const { contacts = [] } = await store.get('contacts');
        const { ids } = args;

        const result = contacts.filter(c => ids.includes(c.id)).map(contact => {
          Object.keys(args).forEach(prop => {
            contact[prop] = args[prop];
          });
          return contact;
        });

        await store.set('contacts', contacts);

        return addRelationData(result);
      },
      async updateOrCreateContacts(obj, { contacts: newContacts = [] }, { store, addRelationData }) {
        const { contacts = [] } = await store.get('contacts');
        let toUpdate = newContacts.filter(c => c.id);
        let toCreate = newContacts.filter(c => !c.id);

        toUpdate = toUpdate.map(data => {
          const contact = contacts.find(c => c.id === data.id);
          Object.keys(data).forEach(prop => {
            contact[prop] = data[prop];
          });
          return contact;
        });

        toCreate = toCreate.map(data => {
          const contact = Object.assign({}, data, { id: uuid(), createdAt: new Date() });
          contacts.push(contact);
          return contact;
        });

        await store.set('contacts', contacts);

        return addRelationData([...toUpdate, ...toCreate]);
      },
      async deleteContact(obj, { id }, { store }) {
        const { contacts = [] } = await store.get('contacts');
        const contact = contacts.find(c => c.id === id);

        if (!contact) {
          return null;
        }

        await store.set('contacts', contacts.filter(c => c.id !== id));
        return id;
      },
      async deleteAllContacts(obj, args, { store }) {
        await store.set('contacts', []);
        return true;
      },
      async createCompany(obj, { name }, { store }) {
        const { companies = [] } = await store.get('companies');
        const company = { id: uuid(), name };
        companies.push(company);
        await store.set('companies', companies);
        return company;
      },
      async createStage(obj, { name }, { store }) {
        const { stages = [] } = await store.get('stages');
        const stage = { id: uuid(), name };
        stages.push(stage);
        await store.set('stages', stages);
        return stage;
      },
      async deleteStage(obj, { id }, { store }) {
        let [{ contacts = [] }, { stages = [] }] = await Promise.all([store.get('contacts'), store.get('stages')]);

        stages = stages.filter(s => s.id !== id);

        contacts = contacts.map(contact => {
          if (contact.stageId === id) {
            contact.stageId = null;
          }
          return contact;
        });

        await Promise.all([store.set('contacts', contacts), store.set('stages', stages)]);

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
      addRelationData: addRelationData(store)
    };

    const { errors, data } = await graphql(schema, query, queryRoot, queryContext, variables);
    response.send({ data, errors });
  })
};
