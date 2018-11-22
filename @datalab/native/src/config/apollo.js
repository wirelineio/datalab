import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { createNetworkStatusNotifier } from 'react-apollo-network-status';

import { ServiceLink, extendClient } from './apollo-link-service';

const BACKEND_ENDPOINT = process.env.BACKEND_URL;

const { NetworkStatusNotifier, link: networkStatusNotifierLink } = createNetworkStatusNotifier();

const cache = new InMemoryCache();

const backendLink = new HttpLink({ uri: `${BACKEND_ENDPOINT}/gql` });

const serviceLink = new ServiceLink({
  fallback: backendLink
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  link: ApolloLink.from([networkStatusNotifierLink, errorLink, serviceLink]),
  cache
});

extendClient(client, serviceLink);

export { NetworkStatusNotifier };

export default client;
