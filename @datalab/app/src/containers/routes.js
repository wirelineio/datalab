import Organizations from './Organizations';
import Contacts from './Contacts';
import Services from './Services';

import ContactsIcon from '@material-ui/icons/Contacts';
import OrganizationsIcon from '@material-ui/icons/GroupWork';
import ServicesIcon from '@material-ui/icons/Share';

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
    sidebar: true
  }
];

export const findByName = name => routes.find(r => r.name === name);
