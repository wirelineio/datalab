import React from 'react';
import { AppLoading } from 'expo';
import { StyleSheet, Platform, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { useScreens } from 'react-native-screens';

import getTheme from '../style/native-base-theme/components';
import material from '../style/native-base-theme/variables/material';

import Navigation from '../navigation';
import { StyleProvider } from 'native-base';

// workaround for large android status bar in react-nav beta.27
if (Platform.OS === 'android') {
  useScreens();
  SafeAreaView.setStatusBarHeight(0);
}

export default class App extends React.Component {
  state = {
    ready: false
  };

  componentDidMount() {
    this.setState({ ready: true });
  }

  render() {
    if (!this.state.ready) {
      return <AppLoading />;
    }

    return (
      <StyleProvider style={getTheme(material)}>
        <View style={styles.container}>
          {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}

          <Navigation />

          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        </View>
      </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)'
  }
});
