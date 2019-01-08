import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, CardItem, Text, Left, Body, Badge } from 'native-base';

import { material } from '../../style/variables';
import Icon from '../Icon';
import List from '../contacts/List';
import { Row, Col } from '../Layout';

const OrganizationsDetail = props => {
  const {
    onContactPress,
    organization: { name, url, stage, goals, contacts }
  } = props;

  return (
    <Col>
      <Row style={{ flex: 0, flexShrink: 1 }}>
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
                <Text style={styles.stageText}>{stage ? stage.name : 'Uncategorized'}</Text>
              </Badge>
            </Left>
          </CardItem>
        </Card>
      </Row>
      <Row style={{ flex: 0, flexShrink: 1 }}>
        <Card style={styles.card}>
          <CardItem>
            <Text>Contacts:</Text>
          </CardItem>
          <List data={contacts} onItemPress={id => onContactPress(contacts.find(c => c.id === id))} />
        </Card>
      </Row>
    </Col>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1
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
    fontSize: 16
  }
});

export default OrganizationsDetail;
