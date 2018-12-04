import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import Partners from '../containers/Partners';

const Icon = ({ name, size, color = '#fff', onPress = null }) => (
  <MaterialIcons name={name} size={size} color={color} onPress={onPress} />
);

const screens = {
  Partners: {
    title: 'Partners',
    container: Partners,
    drawerIcon: ({ tintColor }) => <Icon name="group" color={tintColor} size={24} />,
    contentLeft: ({ navigation }) => <Icon name="menu" onPress={navigation.openDrawer} color="#fff" size={24} />
  }
};

export default screens;
