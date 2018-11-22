import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { compose, graphql, withApollo } from 'react-apollo';
import { GET_ALL_PARTNERS } from '../stores/orgs';
import { GET_SERVICES, getType } from '../stores/services';
import List from '../components/partners/List';

const Partners = props => {
  const { partners = [] } = props;

  // const partners = Array.from({ length: 40 }).map((_, i) => ({
  //   id: i,
  //   name: `Pirlo ${i}`,
  //   extra: `Soy un subtítulo para Pirlo ${i}`
  // }));

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        <List data={partners} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    flex: 1
  }
});

export default compose(
  withApollo,
  graphql(GET_SERVICES, {
    props({ data: { services = [] }, ownProps: { client } }) {
      services = services.map(s => ({ ...s, type: getType(s) }));

      client.updateServices(services);
      return { services: services.filter(s => s.enabled) };
    }
  }),
  graphql(GET_ALL_PARTNERS, {
    skip({ services = [] }) {
      return !services.find(s => s.type === 'orgs');
    },
    options: {
      context: {
        serviceType: 'orgs'
      },
      fetchPolicy: 'cache-and-network'
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
