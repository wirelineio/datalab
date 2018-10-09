import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Typeface
import 'typeface-roboto';

import DashboardIcon from '@material-ui/icons/Dashboard';
import ScatterPlotIcon from '@material-ui/icons/ScatterPlot';

import Layout from '../components/Layout';

import Main from './Main';
import Services from './Services';

const routes = [
  {
    exact: true,
    path: '/',
    title: 'Dashboard',
    component: Main,
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
      <BrowserRouter>
        <Layout routes={routes}>
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
