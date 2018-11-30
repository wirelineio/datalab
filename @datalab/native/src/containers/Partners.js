import React from 'react';
import { View, StyleSheet } from 'react-native';
import { compose, graphql, withApollo } from 'react-apollo';
import { GET_ALL_PARTNERS } from '../stores/orgs';
import { GET_SERVICES, getType } from '../stores/services';
import List from '../components/partners/List';

const Partners = props => {
  // const { partners = [] } = props;

  const partners = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    name: `Pirlo ${i}`,
    url: `http://pirlo${i}.com`
  }));

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

export default Partners;

// export default compose(
//   withApollo,
//   graphql(GET_SERVICES, {
//     options: {
//       context: {
//         useNetworkStatusNotifier: false
//       }
//     },
//     props({ data: { services = [] }, ownProps: { client } }) {
//       services = services.map(s => ({ ...s, type: getType(s) }));

//       client.updateServices(services);
//       return { services: services.filter(s => s.enabled) };
//     }
//   }),
//   graphql(GET_ALL_PARTNERS, {
//     options: {
//       pollInterval: 30000
//     },
//     props({ data: { partners = [], stages = [], loading } }) {
//       return {
//         partners,
//         stages,
//         loading
//       };
//     }
//   })
// )(Partners);
