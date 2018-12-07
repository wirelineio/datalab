import { createDrawerNavigator, createAppContainer } from 'react-navigation';
import OrganizationsScreen from './screens/organizations';
import ContactsScreen from './screens/contacts';

const RootNavigator = createDrawerNavigator(
  {
    Organizations: OrganizationsScreen,
    Contacts: ContactsScreen
  },
  { drawerType: 'slide' }
);

const AppContainer = createAppContainer(RootNavigator);

export default AppContainer;
