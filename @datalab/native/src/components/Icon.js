import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import styled from 'styled-components/native';
import { prop, ifProp } from 'styled-tools';

const ICON_PADDING = 16;
const ICON_SIZE = 32;

const StyledIcon = styled(MaterialIcons)`
  color: ${prop('color', 'white')};
  border-radius: ${ifProp('rounded', prop('size', ICON_SIZE), 0)}px;
  font-size: ${({ size = ICON_SIZE, padding = ICON_PADDING, rounded }) => size - (rounded ? padding / 2 : 0)};
`;

const IconWrapper = styled.TouchableOpacity`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  background-color: ${prop('backgroundColor', 'transparent')};
  border-radius: ${ifProp('rounded', prop('size', ICON_SIZE), 0)}px;
  width: ${prop('size', ICON_SIZE)}px;
  height: ${prop('size', ICON_SIZE)}px;
`;

const Icon = ({ onPress, backgroundColor, ...rest }) => (
  <IconWrapper onPress={onPress} backgroundColor={backgroundColor} size={rest.size} rounded={rest.rounded}>
    <StyledIcon {...rest} />
  </IconWrapper>
);

export const RoundedIcon = props => <Icon {...props} rounded />;

export default Icon;
