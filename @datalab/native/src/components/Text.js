import styled from 'styled-components/native';
import { Text } from 'react-native';
import { fontSize, color, lineHeight, textDecorationLine, fontWeight, padding } from '../lib/style';

export const InfoText = styled(Text)`
  font-size: 12;
  color: #cccccc;
`;

export default styled(Text).attrs({
  textAlignVertical: 'center'
})`
  ${fontSize}
  ${color}
  ${lineHeight}
  ${textDecorationLine}
  ${fontWeight}
  ${padding}
`;
