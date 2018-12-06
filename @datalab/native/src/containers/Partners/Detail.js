import React from 'react';
import { Content } from 'native-base';

import PartnersDetail from '../../components/partners/Detail';

export default props => {
  const { navigation } = props;
  const partner = navigation.getParam('partner');
  return (
    <Content>
      <PartnersDetail
        partner={partner}
        onContactPress={contact => navigation.navigate('ContactsDetail', { contact })}
      />
    </Content>
  );
};
