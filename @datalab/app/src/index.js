import React from 'react';
import ReactDOM from 'react-dom';

// Apollo
import { ApolloProvider } from 'react-apollo';

import { ApolloConfig } from '@datalab/core';

const { client, NetworkStatusNotifier } = new ApolloConfig({
  backendEndpoint: window.config.BACKEND_ENDPOINT
});

// Ours
import App from './containers/App';

ReactDOM.render(
  <ApolloProvider client={client}>
    <App NetworkStatusNotifier={NetworkStatusNotifier} />
  </ApolloProvider>,
  document.getElementById('ux-root')
);
