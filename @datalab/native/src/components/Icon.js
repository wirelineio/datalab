import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import styled from 'styled-components/native';

const ICON_PADDING = 8;
const ICON_SIZE = 28;

const Icon = styled(MaterialIcons)`
  width: ${props => props.size || ICON_SIZE}px;
  height: ${props => props.size || ICON_SIZE}px;
  color: ${props => props.color || 'white'};
  font-size: ${props => props.size || ICON_SIZE};
`;

const RoundedIconWrapper = styled.View`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  background-color: ${props => props.backgroundColor || 'transparent'};
  border-radius: ${props => props.size || ICON_SIZE}px;
  padding: ${ICON_PADDING}px;
`;

export const RoundedIcon = props => (
  <RoundedIconWrapper {...props}>
    <Icon {...props} size={(props.size || ICON_SIZE) - ICON_PADDING} />
  </RoundedIconWrapper>
);

export default Icon;
