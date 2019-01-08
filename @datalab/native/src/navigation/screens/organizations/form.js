import React from 'react';
import OrganizationsForm from '../../../containers/OrganizationForm';
import Icon from '../../../components/Icon';
import { goBack } from '../../common';

export default {
  screen: OrganizationsForm,
  navigationOptions: ({ navigation }) => ({
    title: `${navigation.getParam('organization') ? 'Edit' : 'Create'} organization`,
    headerLeft: <Icon name="arrow-back" onPress={() => goBack(navigation)} color="#fff" size={24} />
  })
};
