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

const addRelations = store => async record => {
  const [{ stages = [] }, { contacts = [] }] = await Promise.all([store.get('stages'), store.get('contacts')]);

  if (Array.isArray(record)) {
    return record.map(r => {
      r.stage = stages.find(stage => stage.id === r.stageId);
      r.contacts = contacts.filter(c => r.contactIds && r.contactIds.includes(c.id));
      return r;
    });
  }

  record.stage = stages.find(stage => stage.id === record.stageId);
  record.contacts = contacts.filter(c => record.contactIds && record.contactIds.includes(c.id));
  return record;
};

const schema = makeExecutableSchema({
  // Schema types.
  typeDefs: concatenateTypeDefs([SourceSchema]),

  // http://dev.apollodata.com/tools/graphql-tools/resolvers.html
  resolvers: {
    Query: {
      async getAllPartners(obj, args, { store, addRelations }) {
        const { partners = [] } = await store.get('partners');
        return addRelations(partners);
      },
      async getAllStages(obj, args, { store }) {
        const { stages = [] } = await store.get('stages');
        return stages;
      }
    },
    Mutation: {
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
      },
      async createPartner(obj, args, { store, addRelations }) {
        const { partners = [] } = await store.get('partners');
        const partner = Object.assign({}, args, { id: uuid(), contactIds: [] });
        partners.push(partner);
        await store.set('partners', partners);
        return addRelations(partner);
      },
      async updatePartner(obj, { id, ...args }, { store, addRelations }) {
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

        return addRelations(partners[idx]);
      },
      async deletePartner(obj, { id }, { store }) {
        let { partners = [] } = await store.get('partners');
        partners = partners.filter(p => p.id !== id);
        await store.set('partners', partners);
        return id;
      },
      async addContactToPartner(obj, { id, contactId }, { store, addRelations }) {
        const { partners = [] } = await store.get('partners');
        const partner = partners.find(p => p.id === id);

        if (!partner) {
          return null;
        }

        if (!partner.contactIds.includes(contactId)) {
          partner.contactIds.push(contactId);
        }

        await store.set('partners', partners);

        return addRelations(partner);
      },
      async deleteContactToPartner(obj, { id, contactId }, { store, addRelations }) {
        const { partners = [] } = await store.get('partners');
        const partner = partners.find(p => p.id === id);

        if (!partner) {
          return null;
        }

        partner.contactIds = partner.contactIds.filter(id => id !== contactId);

        await store.set('partners', partners);

        return addRelations(partner);
      },
      async moveContactToPartner(obj, { id, toPartner, contactId }, { store, addRelations }) {
        const { partners = [] } = await store.get('partners');
        const partnerFrom = partners.find(p => p.id === id);
        const partnerTo = partners.find(p => p.id === toPartner);

        if (!partnerFrom || !partnerTo) {
          return null;
        }

        partnerFrom.contactIds = partnerFrom.contactIds.filter(id => id !== contactId);
        if (!partnerTo.contactIds.includes(contactId)) {
          partnerTo.contactIds.push(contactId);
        }

        await store.set('partners', partners);

        return addRelations([partnerFrom, partnerTo]);
      },
      async createStage(obj, { name }, { store }) {
        const { stages = [] } = await store.get('stages');
        const stage = { id: uuid(), name };
        stages.push(stage);
        await store.set('stages', stages);
        return stage;
      },
      async updateStage(obj, { id, name }, { store }) {
        const { stages = [] } = await store.get('stages');
        const idx = stages.findIndex(s => s.id === id);

        stages[idx] = {
          id,
          name
        };

        await store.set('stages', stages);

        return stages[idx];
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
      addRelations: addRelations(store)
    };

    const { errors, data } = await graphql(schema, query, queryRoot, queryContext, variables);
    response.send({ data, errors });
  })
};
