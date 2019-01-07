import React from 'react';
// import { Content as NBContent } from 'native-base';
import { Col as RNEGCol, Row as RNEGRow, Grid as RNEGGrid } from 'react-native-easy-grid';
import styled from 'styled-components/native';
import { ifProp, prop } from 'styled-tools';

const StyledScreen = styled(RNEGGrid)`
  padding: ${ifProp('withPadding', prop('padding', 16), 0)}px;
`;

export const Col = styled(RNEGCol)``;

export const Row = styled(RNEGRow)``;

export const Screen = ({ withPadding = false, children, ...rest }) => (
  <StyledScreen withPadding={withPadding} {...rest}>
    <Col>{children}</Col>
  </StyledScreen>
);
