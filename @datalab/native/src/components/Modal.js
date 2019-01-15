import React from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';

import Text from './Text';

const ModalContent = styled.View`
  background-color: white;
  padding: 16px;
  padding-bottom: 12px;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border-color: rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled(Text)`
  font-weight: bold;
  margin-bottom: 8px;
`;

export default ({ title, onClose = () => null, onBackButtonPress, onBackdropPress, children }) => (
  <Modal isVisible={true} onBackButtonPress={onBackButtonPress || onClose} onBackdropPress={onBackdropPress || onClose}>
    <ModalContent>
      <ModalTitle>{title}</ModalTitle>
      {children}
    </ModalContent>
  </Modal>
);
