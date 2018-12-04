import { createDrawerNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import screens from './screens';

const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: '#3f51b5'
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold'
  }
};

const buildScreen = ({ container, name, title, contentLeft }) =>
  createStackNavigator(
    {
      [name]: {
        screen: container,
        navigationOptions: ({ navigation }) => ({
          title,
          headerLeft: contentLeft({ navigation }),
          headerLeftContainerStyle: {
            padding: 16,
            marginRight: 0
          },
          headerTitleStyle: {
            marginLeft: 0
          }
        })
      }
    },
    {
      defaultNavigationOptions
    }
  );

const RootNavigator = createDrawerNavigator(
  Object.keys(screens).reduce((all, name) => {
    const { title, drawerIcon } = screens[name];

    all[name] = {
      navigationOptions: {
        drawerLabel: title,
        drawerIcon
      },
      screen: buildScreen(screens[name])
    };

    return all;
  }, {}),
  { drawerType: 'slide' }
);

const AppContainer = createAppContainer(RootNavigator);

export default AppContainer;
