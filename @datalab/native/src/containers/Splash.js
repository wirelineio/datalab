import React, { Component } from 'react';
import { StatusBar } from 'react-native';

import { Screen } from '../components/Layout';
import Welcome from '../components/Welcome';

class Splash extends Component {
  render() {
    return (
      <Screen justifyContent="center" alignItems="center">
        <StatusBar hidden={true} />
        <Welcome />
      </Screen>
    );
  }
}

export default Splash;
