import { createStackNavigator, createAppContainer } from 'react-navigation';
import PartnersScreen from './screens/partners';

const Navigator = createStackNavigator(
  {
    Partners: {
      screen: PartnersScreen
    }
  },
  {
    initialRouteName: 'Partners',
    /* The header config from HomeScreen is now here */
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#3f51b5'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }
  }
);
export default createAppContainer(Navigator);
