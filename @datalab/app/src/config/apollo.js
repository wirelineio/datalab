import merge from 'lodash.merge';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';

import { MatchLink } from './apollo-link-match';

// stores
import stores from '../stores';

const cache = new InMemoryCache();

const fakerLink = new HttpLink({ uri: 'https://fakerql.com/graphql' });

const matchLink = new MatchLink({
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
  link: ApolloLink.from([errorLink, stateLink, matchLink]),
  cache
});

client.onResetStore(stateLink.writeDefaults);

const serviceObservable = client.watchQuery({
  query: require('../stores/board').GET_SERVICES
});

serviceObservable.forEach(({ data: { services } }) => {
  matchLink.updateUserLinks(
    services.filter(s => s.enabled && s.url).map(s => {
      return { type: s.type, link: new HttpLink({ uri: s.url }) };
    })
  );
});

export default client;
