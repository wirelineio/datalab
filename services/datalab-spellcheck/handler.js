//
// Copyright 2017 Wireline, Inc.
//

// Enable source map support.
// https://github.com/evanw/node-source-map-support#programmatic-usage
import 'source-map-support/register';

import Wireline from '@wirelineio/sdk';
import { concatenateTypeDefs, makeExecutableSchema } from 'graphql-tools';
import { graphql } from 'graphql';
import retext from 'retext';
import spell from 'retext-spell';
import dictionary from 'dictionary-en-gb';

import SourceSchema from './schema.graphql';

const schema = makeExecutableSchema({
  // Schema types.
  typeDefs: concatenateTypeDefs([SourceSchema]),

  // http://dev.apollodata.com/tools/graphql-tools/resolvers.html
  resolvers: {
    Query: {
      async check(obj, { value }) {
        const file = await retext()
          .use(spell, dictionary)
          .process(value);

        return file.messages.map(m => ({
          suggestions: m.expected,
          word: m.actual,
          column: m.column,
          line: m.line
        }));
      }
    }
  }
});

module.exports = {
  gql: Wireline.exec(async (event, context, response) => {
    const { body } = event;
    const { query, variables } = typeof body === 'string' ? JSON.parse(body) : body;
    let queryRoot = {};
    let queryContext = {};

    const { errors, data } = await graphql(schema, query, queryRoot, queryContext, variables);
    response.send({ data, errors });
  })
};
