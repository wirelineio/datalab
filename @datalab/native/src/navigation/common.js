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
    headerLeft: <Icon name="menu" onPress={navigation.openDrawer} color="#fff" size={24} />
  })
};

export const goBack = navigation => {
  let backKey = navigation.getParam('backKey', false);
  if (backKey) {
    // clear backKey so navigation doesnt break
    navigation.setParams({ backKey: null });
    // navigate back to other stack navigator
    navigation.navigate(backKey);
  } else {
    // regular go back
    navigation.goBack();
  }
};
