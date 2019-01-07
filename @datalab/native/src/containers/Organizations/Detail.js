import React from 'react';

import OrganizationsDetail from '../../components/organizations/Detail';
import { Col, Screen } from '../../components/Layout';

export default props => {
  const { navigation } = props;
  const organization = navigation.getParam('organization');
  return (
    <Screen withPadding padding={8}>
      <OrganizationsDetail
        organization={organization}
        onContactPress={contact => navigation.navigate('ContactsDetail', { contact, backKey: 'OrganizationsDetail' })}
      />
    </Screen>
  );
};
