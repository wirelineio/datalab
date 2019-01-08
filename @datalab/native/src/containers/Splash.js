import React from 'react';
import { StyleSheet } from 'react-native';
import { Content, Text, H1 } from 'native-base';
import { material } from '../style/variables';

class Splash extends React.Component {
  render() {
    return (
      <Content contentContainerStyle={styles.splash}>
        <Text>Welcome to</Text>
        <H1 style={styles.datalabText}>Datalab</H1>
      </Content>
    );
  }
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  datalabText: {
    color: material.brandInfo,
    fontWeight: 'bold'
  }
});

export default Splash;
