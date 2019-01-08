import React from 'react';

import { Card, CardItem, Text, Left, Body, Icon as NativeBaseIcon, Button } from 'native-base';

import { material } from '../../style/variables';
import { RoundedIcon } from '../../components/Icon';
import { Col } from '../../components/Layout';

const ContactsDetail = props => {
  const {
    contact: { name, email, phone },
    onEmailPress,
    onPhonePress
  } = props;
  return (
    <Col>
      <Card>
        <CardItem>
          <Left>
            <RoundedIcon name="person" backgroundColor={material.brandInfo} />
            <Body>
              <Text>{name}</Text>
              <Text note onPress={onEmailPress}>
                {email}
              </Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem>
          <Left>
            <Button transparent onPress={onPhonePress}>
              <NativeBaseIcon active name="md-call" />
              <Text>{phone}</Text>
            </Button>
          </Left>
        </CardItem>
      </Card>
    </Col>
  );
};

export default ContactsDetail;
