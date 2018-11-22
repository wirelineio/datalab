import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import internalModule from '@datalab/core';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>{internalModule()}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
