import React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { Content, Spinner } from 'native-base';

import { GET_SERVICES } from '../../stores/services';
import List from '../../components/contacts/List';
import { GET_ALL_CONTACTS } from '../../stores/contacts';

const Contacts = props => {
  const { contacts = [], loading, navigation } = props;

  // const { navigation } = props;
  // const loading = false;
  // const contacts = Array.from({ length: 30 }).map((_, i) => ({
  //   id: i,
  //   name: `Pirlo ${i}`,
  //   phone: '12354671',
  //   email: `pirlo${i}@noexistedomain.com`
  // }));

  if (loading) {
    return <Spinner />;
  }

  return (
    <Content>
      <List
        data={contacts}
        onItemPress={id => navigation.push('ContactsDetail', { contact: contacts.find(c => id === c.id) })}
      />
    </Content>
  );
};

export default compose(
  withApollo,
  graphql(GET_SERVICES, {
    options: {
      context: {
        useNetworkStatusNotifier: false
      }
    },
    props({ data: { services = [] }, ownProps: { client } }) {
      client.updateServices(services);
      const servicesEnabled = services.filter(s => s.enabled);
      return {
        services: servicesEnabled,
        contactServices: servicesEnabled.filter(s => s.type === 'contacts')
      };
    }
  }),
  graphql(GET_ALL_CONTACTS, {
    options: {
      pollInterval: 30000,
      context: {
        useNetworkStatusNotifier: false
      }
    },
    props({ data: { contacts = [], loading = false } }) {
      return { contacts, loading };
    }
  })
)(Contacts);
