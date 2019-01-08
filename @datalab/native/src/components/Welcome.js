import React, { Fragment } from 'react';
import { H1, Text } from 'native-base';
import styled from 'styled-components/native';

import { material } from '../style/variables';

const Subtitle = styled(H1)`
  color: ${material.brandInfo};
  font-weight: bold;
`;

export default () => (
  <Fragment>
    <Text>Welcome to</Text>
    <Subtitle>Datalab</Subtitle>
  </Fragment>
);
