/* eslint-disable no-undef */
import { KeepAwake, registerRootComponent } from 'expo';
import React from 'react';
import { ApolloProvider } from 'react-apollo';

import App from './containers/App';

import ApolloConfig from '@datalab/apollo-config';

const apolloConfig = new ApolloConfig({
  backendEndpoint: process.env.BACKEND_URL,
  localhostServiceHost: process.env.LAN_IP
});

const DatalabNative = () => (
  <ApolloProvider client={apolloConfig.client}>
    <App />
  </ApolloProvider>
);

if (__DEV__) {
  KeepAwake.activate();
}

registerRootComponent(DatalabNative);
