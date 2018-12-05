import { createDrawerNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from './screens/home';
import PartnersScreen from './screens/partners';

const RootNavigator = createDrawerNavigator(
  {
    Home: HomeScreen,
    Partners: PartnersScreen
  },
  { drawerType: 'slide' }
);
const AppContainer = createAppContainer(RootNavigator);

export default AppContainer;
