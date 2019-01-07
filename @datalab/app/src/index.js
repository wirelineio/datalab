import React from 'react';
import ReactDOM from 'react-dom';

// Apollo
import { ApolloProvider } from 'react-apollo';
import { createNetworkStatusNotifier } from 'react-apollo-network-status';
import ApolloConfig from '@datalab/apollo-config';

// Ours
import App from './App';

const { link: networkStatusNotifierLink, NetworkStatusNotifier } = createNetworkStatusNotifier();

const { client } = new ApolloConfig({
  backendEndpoint: window.config.BACKEND_ENDPOINT,
  networkStatusNotifierLink
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App NetworkStatusNotifier={NetworkStatusNotifier} />
  </ApolloProvider>,
  document.getElementById('ux-root')
);
