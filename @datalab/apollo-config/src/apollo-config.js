import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { createNetworkStatusNotifier } from 'react-apollo-network-status';

import { ServiceLink, extendClient } from './apollo-link-service';

class ApolloConfig {
  constructor({ backendEndpoint, localhostServiceHost = null }) {
    this.backendEndpoint = backendEndpoint;
    this.networkStatusNotifier = createNetworkStatusNotifier();
    this.client = this.buildClient(localhostServiceHost);
  }

  get NetworkStatusNotifier() {
    return this.networkStatusNotifier.NetworkStatusNotifier;
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
      link: ApolloLink.from([this.networkStatusNotifier.link, errorLink, serviceLink]),
      cache: new InMemoryCache()
    });

    extendClient(client, serviceLink);

    return client;
  }
}

export default ApolloConfig;
