//
// Copyright 2017 Wireline, Inc.
//

// Enable source map support.
// https://github.com/evanw/node-source-map-support#programmatic-usage
import 'source-map-support/register';

import Wireline from '@wirelineio/sdk';
import { concatenateTypeDefs, makeExecutableSchema } from 'graphql-tools';
import { graphql } from 'graphql';
import alex from 'alex';

import SourceSchema from './schema.graphql';

const schema = makeExecutableSchema({
  // Schema types.
  typeDefs: concatenateTypeDefs([SourceSchema]),

  // http://dev.apollodata.com/tools/graphql-tools/resolvers.html
  resolvers: {
    Query: {
      check(obj, { value }) {
        const messages = alex(value).messages;
        return Object.values(
          messages
            .map(m => ({
              message: m.message,
              ruleId: m.ruleId,
              word: value.slice(m.location.start.offset, m.location.end.offset)
            }))
            .reduce((result, next) => {
              if (!result[next.word]) {
                result[next.word] = {
                  word: next.word,
                  rules: [],
                  messages: []
                };
              }

              if (!result[next.word].rules.includes(next.ruleId)) {
                result[next.word].rules.push(next.ruleId);
                result[next.word].messages.push(next.message);
              }

              return result;
            }, {})
        );
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
