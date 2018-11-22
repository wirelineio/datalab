import React from 'react';
import { AppLoading } from 'expo';
import { StyleSheet, Platform, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { useScreens } from 'react-native-screens';

import Navigation from '../navigation';

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
      <View style={styles.container} testID="native_component_list">
        {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
        <Navigation />

        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
      </View>
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
