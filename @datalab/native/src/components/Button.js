import React from 'react';
// import Icon from './Icon';
import { Button, Text } from 'native-base';
import styled from 'styled-components/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { material } from '../style/variables';
import { prop } from 'styled-tools';

const StyledButton = styled(Button)`
  margin: ${prop('margin', 0)}px;
`;

export default ({ children, ...rest }) => {
  return (
    <StyledButton {...rest}>
      <Text>{children}</Text>
    </StyledButton>
  );
};

const FloattingButtonWrapper = styled(Button)`
  position: absolute;
  width: ${material.fabWidth};
  height: ${material.fabHeight};
  align-items: center;
  justify-content: center;
  right: 16;
  bottom: 16;
`;

const FloattingButtonIcon = styled(MaterialIcons)`
  width: ${props => props.size || 24};
  height: ${props => props.size || 24};
  color: ${props => props.color || 'white'};
  font-size: ${props => props.size || 24};
  text-align: center;
`;

export const FloattingButton = ({ icon, ...rest }) => (
  <FloattingButtonWrapper icon={true} rounded {...rest}>
    <FloattingButtonIcon name={icon} />
  </FloattingButtonWrapper>
);
