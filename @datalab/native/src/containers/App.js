import React from 'react';
import { AppLoading, Font } from 'expo';
import { StyleSheet, Platform, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { useScreens } from 'react-native-screens';
import { StyleProvider, Root } from 'native-base';

import Navigation from '../navigation';
import { buildTheme } from '../style/theme';
import Splash from './Splash';

// workaround for large android status bar in react-nav beta.27
if (Platform.OS === 'android') {
  useScreens();
  SafeAreaView.setStatusBarHeight(0);
}

export default class App extends React.Component {
  state = {
    ready: false,
    fontsReady: false,
    showingSplash: false
  };

  componentDidMount() {
    this.setState({ ready: true });
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf')
    });
    this.setState({ fontsReady: true });
  }

  onHideSplash = () => {
    // this.setState({ showingSplash: false });
  };

  render() {
    if (!this.state.ready || !this.state.fontsReady) {
      return <AppLoading />;
    }

    return (
      <Root>
        <StyleProvider style={buildTheme()}>
          <View style={styles.container}>
            {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}

            {this.state.showingSplash && <Splash onHide={this.onHideSplash} />}

            {!this.state.showingSplash && <Navigation />}

            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          </View>
        </StyleProvider>
      </Root>
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
