import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import ScreenLoader from '../components/ScreenLoader';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import { routes } from './routes';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

class App extends Component {
  render() {
    const { NetworkStatusNotifier } = this.props;
    return (
      <BrowserRouter basename={window.config.PUBLIC_PATH}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <NetworkStatusNotifier render={({ loading }) => <ScreenLoader open={loading} />} />
          <Switch>
            {routes
              .filter(r => r.sidebar)
              .map(({ component: Main, title, ...rest }, key) => (
                <Route
                  key={key}
                  {...rest}
                  render={props => (
                    <Layout title={title} sidebar={<Sidebar routes={routes} {...props} />}>
                      <Main {...props} />
                    </Layout>
                  )}
                />
              ))}
            {routes
              .filter(r => r.default)
              .map(({ path }, key) => (
                <Redirect to={path} key={`redirect-${key}`} />
              ))}
          </Switch>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;
