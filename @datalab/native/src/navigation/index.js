import { createDrawerNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from './screens/home';
import PartnersScreen from './screens/partners';
import ContactsScreen from './screens/contacts';

const RootNavigator = createDrawerNavigator(
  {
    Home: HomeScreen,
    Partners: PartnersScreen,
    Contacts: ContactsScreen
  },
  { drawerType: 'slide' }
);
const AppContainer = createAppContainer(RootNavigator);

export default AppContainer;
