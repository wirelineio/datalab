import React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { Content, Spinner } from 'native-base';

import { GET_SERVICES, getType } from '../../stores/services';
import List from '../../components/contacts/List';
import { GET_ALL_REMOTE_CONTACTS } from '../../stores/contacts';

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
        onItemPress={id => navigation.navigate('ContactsDetail', { contact: contacts.find(c => id === c.id) })}
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
      services = services.map(s => ({ ...s, type: getType(s) }));

      client.updateServices(services);
      return { services: services.filter(s => s.enabled) };
    }
  }),
  graphql(GET_ALL_REMOTE_CONTACTS, {
    skip({ services = [] }) {
      return !services.find(s => s.type === 'contacts');
    },
    options: {
      pollInterval: 30000,
      context: {
        serviceType: 'contacts',
        useNetworkStatusNotifier: false
      }
    },
    props({ data: { contacts = [], loading } }) {
      return { contacts, loading };
    }
  })
)(Contacts);
