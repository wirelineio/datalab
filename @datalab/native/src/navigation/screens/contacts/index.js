import React from 'react';
import { createStackNavigator } from 'react-navigation';

import ContactsListScreen from './list';
import ContactsDetailScreen from './detail';

import Icon from '../../../components/Icon';
import { stackNavigation } from '../../common';

const ContactsScreen = {
  screen: createStackNavigator(
    {
      ContactsList: ContactsListScreen,
      ContactsDetail: ContactsDetailScreen
    },
    { defaultNavigationOptions: stackNavigation.defaultNavigationOptions }
  ),
  navigationOptions: {
    drawerLabel: 'Contacts',
    drawerIcon: ({ tintColor }) => <Icon name="contacts" color={tintColor} size={24} />
  }
};

export default ContactsScreen;
