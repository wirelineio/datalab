import React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { Spinner } from 'native-base';

import { GET_ALL_ORGANIZATIONS } from '../../stores/organizations';
import { GET_SERVICES } from '../../stores/services';
import List from '../../components/organizations/List';
import { FloattingButton } from '../../components/Button';
import { Screen, Col } from '../../components/Layout';

const Organizations = props => {
  const { organizations = [], loading, navigation } = props;

  // const { navigation } = props;
  // const loading = false;
  // const organizations = Array.from({ length: 30 }).map((_, i) => ({
  //   id: i,
  //   name: `Pirlo ${i}`,
  //   url: `http://pirlo${i}.com`,
  //   goals: 'Decentralize the future',
  //   contacts: Array.from({ length: 15 }).map((_, i) => ({
  //     id: i,
  //     name: `Pirlo ${i}`,
  //     phone: '12354671',
  //     email: `pirlo${i}@noexistedomain.com`
  //   }))
  // }));

  if (loading) {
    return <Spinner />;
  }

  return (
    <Screen>
      <List
        data={organizations}
        onItemPress={id =>
          navigation.navigate('OrganizationsDetail', { organization: organizations.find(p => id === p.id) })
        }
      />
      <FloattingButton icon="add" onPress={() => navigation.navigate('OrganizationsForm')} />
    </Screen>
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
      // return for now only the enabled services
      client.updateServices(services);
      const servicesEnabled = services.filter(s => s.enabled);
      return {
        services: servicesEnabled,
        contactServices: servicesEnabled.filter(s => s.type === 'contacts')
      };
    }
  }),
  graphql(GET_ALL_ORGANIZATIONS, {
    options: {
      pollInterval: 30000
    },
    props({ data: { organizations = [], stages = [], loading } }) {
      return {
        organizations,
        stages,
        loading
      };
    }
  })
)(Organizations);
