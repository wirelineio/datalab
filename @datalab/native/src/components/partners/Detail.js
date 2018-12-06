import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Content, Card, CardItem, Text, Left, Body, Badge, H1 } from 'native-base';

import { material } from '../../style/variables';
import Icon from '../Icon';
import List from '../contacts/List';

const PartnersDetail = props => {
  const {
    onContactPress,
    partner: { name, url, stage, goals, contacts }
  } = props;

  return (
    <Content>
      <Card style={styles.card}>
        <CardItem>
          <Left>
            <View style={styles.iconContainer}>
              <Icon name="person" size={16} style={styles.icon} />
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
      <Card style={styles.card}>
        <CardItem>
          <Text>Contacts:</Text>
        </CardItem>
        <List data={contacts} onItemPress={id => onContactPress(contacts.find(c => c.id === id))} />
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
    // lineHeight: 32,
    fontSize: 16
  }
});

export default PartnersDetail;
