import React from 'react';
import { material } from '../style/variables';
import Icon from '../components/Icon';

export const stackNavigation = {
  defaultNavigationOptions: ({ navigation }) => ({
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
  })
};
