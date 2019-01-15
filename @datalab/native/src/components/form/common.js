import { View } from 'react-native';
import { Item, Text as NBText } from 'native-base';
import styled from 'styled-components/native';
import { material } from '../../style/variables';

export const FieldWrapper = styled(View)`
  margin-bottom: 8px;
  margin-top: 0px;
  margin-left: 0px;
  padding: 0px;
`;

export const FieldHelper = styled(NBText)`
  margin: 0;
  margin-left: 8px;
`;

export const ErrorFieldHelper = styled(FieldHelper)`
  color: ${material.brandDanger};
`;

export const FieldItem = styled(Item)`
  margin: 8px;
  margin-left: 8px;
  margin-bottom: 0px;
`;
