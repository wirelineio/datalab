/* eslint-disable no-undef */
import { KeepAwake, registerRootComponent } from 'expo';
import React from 'react';
import { ApolloProvider } from 'react-apollo';

import { default as client } from './config/apollo';
import App from './containers/App';

const DatalabNative = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

if (__DEV__) {
  KeepAwake.activate();
}

registerRootComponent(DatalabNative);
