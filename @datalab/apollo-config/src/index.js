import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';

import { ServiceLink, extendClient } from './apollo-link-service';

class ApolloConfig {
  constructor({ backendEndpoint, networkStatusNotifierLink = null, localhostServiceHost = null }) {
    this.backendEndpoint = backendEndpoint;
    this.networkStatusNotifierLink = networkStatusNotifierLink;
    this.client = this.buildClient(localhostServiceHost);
  }

  buildClient(localhostServiceHost = null) {
    const serviceLink = new ServiceLink({
      fallback: new HttpLink({ uri: `${this.backendEndpoint}/gql` }),
      localhostServiceHost
    });

    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    });

    const client = new ApolloClient({
      link: ApolloLink.from([this.networkStatusNotifierLink, errorLink, serviceLink].filter(Boolean)),
      cache: new InMemoryCache()
    });

    extendClient(client, serviceLink);

    return client;
  }
}

export default ApolloConfig;
