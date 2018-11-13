import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import DashboardIcon from '@material-ui/icons/Dashboard';
import ScatterPlotIcon from '@material-ui/icons/ScatterPlot';

import Layout from '../components/Layout';

import Dashboard from './Dashboard';
import Services from './Services';

const routes = [
  {
    exact: true,
    path: '/',
    title: 'Dashboard',
    component: Dashboard,
    icon: DashboardIcon
  },
  {
    path: '/services',
    title: 'Services',
    component: Services,
    icon: ScatterPlotIcon
  }
];

class App extends Component {
  render() {
    return (
      <BrowserRouter basename={window.config.PUBLIC_PATH}>
        <Layout routes={routes} NetworkStatusNotifier={this.props.NetworkStatusNotifier}>
          <Switch>
            {routes.map((rProps, key) => (
              <Route key={key} {...rProps} />
            ))}
          </Switch>
        </Layout>
      </BrowserRouter>
    );
  }
}

export default App;
