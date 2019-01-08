import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, CardItem, Text, Left, Body } from 'native-base';

import { material } from '../../style/variables';
import { RoundedIcon } from '../Icon';
import List from '../contacts/List';
import { Row, Col } from '../Layout';
import Badge from '../Badge';

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
              <RoundedIcon name="person" backgroundColor={material.brandInfo} />
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
              <Badge success fontSize={16}>
                {stage ? stage.name : 'Uncategorized'}
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
  }
});

export default OrganizationsDetail;
