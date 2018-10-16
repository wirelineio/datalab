import merge from 'lodash.merge';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';

import { ServiceLink, extendClient } from './apollo-link-service';

// stores
import stores from '../stores';

const cache = new InMemoryCache();

const fakerLink = new HttpLink({ uri: 'https://fakerql.com/graphql' });

const serviceLink = new ServiceLink({
  rootLinks: [{ type: 'faker', fakerLink }],
  fallback: fakerLink
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const stateLink = withClientState({
  ...merge(...stores),
  cache
});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, stateLink, serviceLink]),
  cache
});

extendClient(client, serviceLink);

client.onResetStore(stateLink.writeDefaults);

export default client;
