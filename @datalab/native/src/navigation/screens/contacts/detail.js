import ContactsDetail from '../../../containers/Contacts/Detail';
import Icon from '../../../components/Icon';
import React from 'react';
import { goBack } from '../../common';

export default {
  screen: ContactsDetail,
  navigationOptions: ({ navigation }) => ({
    title: navigation.getParam('contact').name,
    headerLeft: <Icon name="arrow-back" onPress={() => goBack(navigation)} color="#fff" size={24} />
  })
};
