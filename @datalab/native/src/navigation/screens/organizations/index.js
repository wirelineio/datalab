import React from 'react';
import { createStackNavigator } from 'react-navigation';

import OrganizationsListScreen from './list';
import OrganizationsDetailScreen from './detail';
import OrganizationsFormScreen from './form';

import Icon from '../../../components/Icon';
import { stackNavigation } from '../../common';

const OrganizationsScreen = {
  screen: createStackNavigator(
    {
      OrganizationsList: OrganizationsListScreen,
      OrganizationsDetail: OrganizationsDetailScreen,
      OrganizationsForm: OrganizationsFormScreen
    },
    { defaultNavigationOptions: stackNavigation.defaultNavigationOptions }
  ),
  navigationOptions: {
    drawerLabel: 'Organizations',
    drawerIcon: ({ tintColor }) => <Icon name="group" color={tintColor} size={24} />
  }
};

export default OrganizationsScreen;
