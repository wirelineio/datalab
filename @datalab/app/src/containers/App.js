import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Layout from '../components/Layout';
import { routes } from './routes';

class App extends Component {
  render() {
    return (
      <BrowserRouter basename={window.config.PUBLIC_PATH}>
        <Layout routes={routes} NetworkStatusNotifier={this.props.NetworkStatusNotifier}>
          <Switch>
            {routes
              .filter(r => r.sidebar)
              .map((rProps, key) => (
                <Route key={key} {...rProps} />
              ))}
          </Switch>
        </Layout>
      </BrowserRouter>
    );
  }
}

export default App;
