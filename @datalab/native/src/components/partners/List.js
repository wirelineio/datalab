import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

import ListItem from './ListItem';

const List = props => {
  const { data } = props;
  return (
    <FlatList
      stickySectionHeadersEnabled
      removeClippedSubviews={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={{ backgroundColor: '#fff' }}
      style={styles.container}
      data={data}
      renderItem={({ item }) => <ListItem title={item.name} subtitle={item.url} />}
      keyExtractor={(item, index) => `${index}`}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default List;
