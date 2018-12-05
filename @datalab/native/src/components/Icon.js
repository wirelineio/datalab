import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';

const Icon = ({ color = '#fff', onPress = null, ...props }) => (
  <MaterialIcons color={color} onPress={onPress} {...props} />
);

export default Icon;
