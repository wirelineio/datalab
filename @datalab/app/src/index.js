import React from 'react';
import ReactDOM from 'react-dom';

// Apollo
import { ApolloProvider } from 'react-apollo';
import { default as client, NetworkStatusNotifier } from './config/apollo';

// Ours
import App from './containers/App';

ReactDOM.render(
  <ApolloProvider client={client}>
    <App NetworkStatusNotifier={NetworkStatusNotifier} />
  </ApolloProvider>,
  document.getElementById('ux-root')
);
