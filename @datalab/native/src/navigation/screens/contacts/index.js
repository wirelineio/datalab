import React from 'react';
import { createStackNavigator } from 'react-navigation';

import ContactsListScreen from './list';
import ContactsDetailScreen from './detail';

import Icon from '../../../components/Icon';
import { material } from '../../../style/variables';

const defaultNavigationOptions = ({ navigation }) => ({
  headerStyle: {
    backgroundColor: material.brandPrimary
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    marginLeft: 0
  },
  headerLeftContainerStyle: {
    padding: 16
  },
  headerLeft: <Icon name="contacts" onPress={navigation.openDrawer} color="#fff" size={24} />
});

const ContactsScreen = {
  screen: createStackNavigator(
    {
      ContactsList: ContactsListScreen,
      ContactsDetail: ContactsDetailScreen
    },
    { defaultNavigationOptions }
  ),
  navigationOptions: {
    drawerLabel: 'Contacts',
    drawerIcon: ({ tintColor }) => <Icon name="contacts" color={tintColor} size={24} />
  }
};

export default ContactsScreen;
