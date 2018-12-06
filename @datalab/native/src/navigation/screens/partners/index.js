import React from 'react';
import { createStackNavigator } from 'react-navigation';

import PartnersListScreen from './list';
import PartnersDetailScreen from './detail';

import Icon from '../../../components/Icon';
import { stackNavigation } from '../../common';

const PartnersScreen = {
  screen: createStackNavigator(
    {
      PartnersList: PartnersListScreen,
      PartnersDetail: PartnersDetailScreen
    },
    { defaultNavigationOptions: stackNavigation.defaultNavigationOptions }
  ),
  navigationOptions: {
    drawerLabel: 'Partners',
    drawerIcon: ({ tintColor }) => <Icon name="group" color={tintColor} size={24} />
  }
};

export default PartnersScreen;
