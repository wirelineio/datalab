import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';

const Icon = ({ name, size, color = '#fff', onPress = null }) => (
  <MaterialIcons name={name} size={size} color={color} onPress={onPress} />
);

export default Icon;
