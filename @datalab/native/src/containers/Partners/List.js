import React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { Content, Spinner } from 'native-base';

import { GET_ALL_PARTNERS } from '../../stores/orgs';
import { GET_SERVICES, getType } from '../../stores/services';
import List from '../../components/partners/List';

const Partners = props => {
  const { partners = [], loading, navigation } = props;

  // const { navigation } = props;
  // const loading = false;
  // const partners = Array.from({ length: 30 }).map((_, i) => ({
  //   id: i,
  //   name: `Pirlo ${i}`,
  //   url: `http://pirlo${i}.com`,
  //   goals: 'Decentralize the future'
  // }));

  if (loading) {
    return <Spinner />;
  }

  return (
    <Content>
      <List
        data={partners}
        onItemPress={id => navigation.navigate('PartnersDetail', { partner: partners.find(p => id === p.id) })}
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
  graphql(GET_ALL_PARTNERS, {
    options: {
      pollInterval: 30000
    },
    props({ data: { partners = [], stages = [], loading } }) {
      return {
        partners,
        stages,
        loading
      };
    }
  })
)(Partners);
