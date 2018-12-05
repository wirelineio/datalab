import React from 'react';
import { StyleSheet } from 'react-native';
import { Content, Text, H1 } from 'native-base';
import material from '../style/native-base-theme/variables/material';

class Home extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.navigate('Partners');
    }, 3000);
  }

  render() {
    return (
      <Content contentContainerStyle={styles.main}>
        <Text>Welcome to</Text>
        <H1 style={styles.datalabText}>Datalab</H1>
      </Content>
    );
  }
}

const styles = StyleSheet.create({
  main: {
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

export default Home;
