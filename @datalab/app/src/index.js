import React from 'react';
import ReactDOM from 'react-dom';

// Apollo
import { ApolloProvider } from 'react-apollo';
import { createNetworkStatusNotifier } from 'react-apollo-network-status';
import ApolloConfig from '@datalab/apollo-config';

const { link: networkStatusNotifierLink, NetworkStatusNotifier } = createNetworkStatusNotifier();

const { client } = new ApolloConfig({
  backendEndpoint: window.config.BACKEND_ENDPOINT,
  networkStatusNotifierLink
});

// Ours
import App from './containers/App';

ReactDOM.render(
  <ApolloProvider client={client}>
    <App NetworkStatusNotifier={NetworkStatusNotifier} />
  </ApolloProvider>,
  document.getElementById('ux-root')
);
