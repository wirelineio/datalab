import React from 'react';
import Home from '../../containers/Home';
import Icon from '../../components/Icon';

const HomeScreen = {
  screen: Home,
  navigationOptions: {
    drawerLabel: 'Home',
    drawerIcon: ({ tintColor }) => <Icon name="home" color={tintColor} size={24} />
  }
};

export default HomeScreen;
