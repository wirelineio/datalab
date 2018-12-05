import React from 'react';
import { createStackNavigator } from 'react-navigation';

import PartnersListScreen from './list';
import PartnersDetailScreen from './detail';

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
  headerLeft: <Icon name="group" onPress={navigation.openDrawer} color="#fff" size={24} />
});

const PartnersScreen = {
  screen: createStackNavigator(
    {
      PartnersList: PartnersListScreen,
      PartnersDetail: PartnersDetailScreen
    },
    { defaultNavigationOptions }
  ),
  navigationOptions: {
    drawerLabel: 'Partners',
    drawerIcon: ({ tintColor }) => <Icon name="group" color={tintColor} size={24} />
  }
};

export default PartnersScreen;
