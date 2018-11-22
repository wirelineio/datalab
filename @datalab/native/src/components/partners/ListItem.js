import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

class ListItem extends React.PureComponent {
  render() {
    const { title, subtitle } = this.props;
    return (
      <TouchableHighlight underlayColor={'#555'}>
        <View style={styles.container}>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontWeight: 'bold'
  },
  subtitle: {
    color: '#ccc'
  }
});

export default ListItem;
