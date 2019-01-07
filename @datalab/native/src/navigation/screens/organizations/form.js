import React from 'react';
import OrganizationsForm from '../../../containers/Organizations/Form';
import Icon from '../../../components/Icon';
import { goBack } from '../../common';

export default {
  screen: OrganizationsForm,
  navigationOptions: ({ navigation }) => ({
    title: 'Create organization',
    headerLeft: <Icon name="arrow-back" onPress={() => goBack(navigation)} color="#fff" size={24} />
  })
};
