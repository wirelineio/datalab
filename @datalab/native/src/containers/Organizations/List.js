import React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { Content, Spinner } from 'native-base';

import { GET_ALL_ORGANIZATIONS } from '../../stores/organizations';
import { GET_SERVICES, getType } from '../../stores/services';
import List from '../../components/organizations/List';

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
    <Content>
      <List
        data={organizations}
        onItemPress={id => navigation.navigate('OrganizationsDetail', { organization: organizations.find(p => id === p.id) })}
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
