import React from 'react';
import OrganizationsDetail from '../../../containers/Organization';
import Icon from '../../../components/Icon';
import { goBack } from '../../common';

export default {
  screen: OrganizationsDetail,
  navigationOptions: ({ navigation }) => ({
    title: navigation.getParam('organization').name,
    headerLeft: <Icon name="arrow-back" onPress={() => goBack(navigation)} color="#fff" size={24} />,
    headerRight: (
      <Icon
        name="create"
        onPress={() => navigation.navigate('OrganizationsForm', { organization: navigation.getParam('organization') })}
        color="#fff"
        size={24}
      />
    )
  })
};
