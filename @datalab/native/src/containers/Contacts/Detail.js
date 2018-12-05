import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';

import { Content, Card, CardItem, Text, Left, Body, Icon as NativeBaseIcon, Button } from 'native-base';

import { material } from '../../style/variables';
import Icon from '../../components/Icon';

const PartnersDetail = props => {
  const { name, email, phone } = props.navigation.getParam('contact');
  return (
    <Content>
      <Card style={styles.card}>
        <CardItem>
          <Left>
            <View style={styles.iconContainer}>
              <Icon name="person" style={styles.icon} />
            </View>
            <Body>
              <Text>{name}</Text>
              <Text note onPress={() => Linking.openURL(`mailto:${email}`)}>
                {email}
              </Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem>
          <Left>
            <Button transparent onPress={() => Linking.openURL(`tel:${phone}`)}>
              <NativeBaseIcon active name="md-call" />
              <Text>{phone}</Text>
            </Button>
          </Left>
        </CardItem>
      </Card>
    </Content>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 0,
    marginLeft: 4,
    marginRight: 4
  },
  icon: {
    paddingTop: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconContainer: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: material.brandInfo
  }
});

export default PartnersDetail;
