import React from 'react';
import { Content } from 'native-base';

import OrganizationsDetail from '../../components/organizations/Detail';

export default props => {
  const { navigation } = props;
  const organization = navigation.getParam('organization');
  return (
    <Content>
      <OrganizationsDetail
        organization={organization}
        onContactPress={contact => navigation.navigate('ContactsDetail', { contact, backKey: 'OrganizationsDetail' })}
      />
    </Content>
  );
};
