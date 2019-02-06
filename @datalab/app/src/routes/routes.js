import ContactsIcon from '@material-ui/icons/Contacts';
import OrganizationsIcon from '@material-ui/icons/GroupWork';
import ServicesIcon from '@material-ui/icons/Share';

import Organizations from '../containers/Organizations';
import Contacts from '../containers/Contacts';
import Services from '../containers/Services';

import { CLAIMS } from '../constants';

export const routes = [
  {
    name: 'organizations',
    path: '/organizations',
    title: 'Organizations',
    component: Organizations,
    icon: OrganizationsIcon,
    default: true,
    sidebar: true
  },
  {
    name: 'contacts',
    path: '/contacts',
    title: 'Contacts',
    component: Contacts,
    icon: ContactsIcon,
    sidebar: true
  },
  {
    name: 'services',
    path: '/services',
    title: 'Services',
    component: Services,
    icon: ServicesIcon,
    sidebar: true,
    claims: [CLAIMS.ADMIN]
  }
];

export const findByName = name => routes.find(r => r.name === name);
