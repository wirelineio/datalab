import React from 'react';
import styled from 'styled-components/native';
import { Badge, Text } from 'native-base';
import { prop, ifProp } from 'styled-tools';

const StyledBadge = styled(Badge)`
  display: flex;
  justify-content: center;
`;

const BadgeText = styled(Text)`
  ${ifProp('fontSize', `font-size: ${prop('fontSize')};`)}
`;

export default ({ children, ...rest }) => (
  <StyledBadge {...rest}>
    <BadgeText>{children}</BadgeText>
  </StyledBadge>
);
