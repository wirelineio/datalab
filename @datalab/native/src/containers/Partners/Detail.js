import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Content, Card, CardItem, Text, Left, Body, Badge } from 'native-base';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { material } from '../../style/variables';

const Icon = ({ name }) => (
  <View>
    <MaterialIcons name={name} size={16} color="#fff" style={styles.icon} />
  </View>
);

const PartnersDetail = props => {
  const { name, url, stage, goals } = props.navigation.getParam('partner');
  return (
    <Content>
      <Card style={styles.card}>
        <CardItem>
          <Left>
            <View style={styles.iconContainer}>
              <Icon name="person" />
            </View>
            <Body>
              <Text>{name}</Text>
              <Text note>{url}</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem>
          <Body>
            <Text>{goals}</Text>
          </Body>
        </CardItem>
        <CardItem>
          <Left>
            <Badge success>
              <Text style={styles.stageText}>{stage || 'Uncategorized'}</Text>
            </Badge>
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
  },
  stageText: {
    lineHeight: 32,
    fontSize: 16
  }
});

export default PartnersDetail;
