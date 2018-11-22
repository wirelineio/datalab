import Dashboard from './Dashboard';
import Services from './Services';

import DashboardIcon from '@material-ui/icons/Dashboard';
import ScatterPlotIcon from '@material-ui/icons/ScatterPlot';

export const routes = [
  {
    name: 'services',
    path: '/services',
    title: 'Services',
    component: Services,
    icon: ScatterPlotIcon,
    sidebar: true
  },
  {
    name: 'dashboard',
    path: '/',
    title: 'Dashboard',
    component: Dashboard,
    icon: DashboardIcon,
    sidebar: true
  }
];

export const findByName = name => routes.find(r => r.name === name);
