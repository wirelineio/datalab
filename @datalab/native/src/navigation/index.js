import { createDrawerNavigator, createAppContainer } from 'react-navigation';
import PartnersScreen from './screens/partners';
import ContactsScreen from './screens/contacts';

const RootNavigator = createDrawerNavigator(
  {
    Partners: PartnersScreen,
    Contacts: ContactsScreen
  },
  { drawerType: 'slide' }
);

const AppContainer = createAppContainer(RootNavigator);

export default AppContainer;
