import React from 'react';
import { Linking } from 'react-native';

import { Screen } from '../components/Layout';
import ContactsDetail from '../components/contacts/Detail';

export default props => {
  const contact = props.navigation.getParam('contact');
  return (
    <Screen withPadding padding={8}>
      <ContactsDetail
        contact={contact}
        onEmailPress={() => Linking.openURL(`mailto:${contact.email}`)}
        onPhonePress={() => Linking.openURL(`tel:${contact.phone}`)}
      />
    </Screen>
  );
};
