import React from 'react';
// import { Content as NBContent } from 'native-base';
import { Col as RNEGCol, Row as RNEGRow, Grid as RNEGGrid } from 'react-native-easy-grid';
import styled from 'styled-components/native';
import { ifProp, prop } from 'styled-tools';

const StyledScreen = styled(RNEGGrid)`
  padding: ${ifProp('withPadding', prop('padding', 16), 0)}px;
`;

export const Col = styled(RNEGCol)`
  ${ifProp('justifyContent', ({ justifyContent }) => `justify-content: ${justifyContent}`)};
  ${ifProp('alignItems', ({ alignItems }) => `align-items: ${alignItems}`)};
`;

export const Row = styled(RNEGRow)``;

export const Screen = ({ withPadding = false, children, ...rest }) => (
  <StyledScreen withPadding={withPadding} {...rest}>
    <Col {...rest}>{children}</Col>
  </StyledScreen>
);
