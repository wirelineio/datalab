import React from 'react';
import { ScrollView, StyleSheet, Linking } from 'react-native';
import { List as NativeBaseList, ListItem, Left, Body, Right, Text, Button } from 'native-base';
import { material } from '../../style/variables';
import Icon, { RoundedIcon } from '../Icon';
import { InfoText } from '../Text';

const List = props => {
  const { data, onItemPress } = props;

  return (
    <ScrollView>
      <NativeBaseList>
        {!data.length && (
          <ListItem avatar>
            <Body>
              <InfoText>No contacts to show.</InfoText>
            </Body>
          </ListItem>
        )}
        {data.map(({ id, name, phone, email }, index) => (
          <ListItem key={index} avatar onPress={() => onItemPress(id)}>
            <Left style={[styles.centerFlex, styles.itemLeftAndRight]}>
              <RoundedIcon name="person" backgroundColor={material.brandPrimary} color="#fff" />
            </Left>
            <Body>
              <Text>{name}</Text>
              <Text note>{email}</Text>
            </Body>
            <Right style={styles.centerFlex}>
              <Button transparent rounded style={[styles.centerFlex, styles.callButton]}>
                <Icon
                  name="call"
                  size={24}
                  color={material.brandPrimary}
                  style={[styles.itemLeftAndRightIcon, styles.callIcon]}
                  onPress={() => Linking.openURL(`tel:${phone}`)}
                />
              </Button>
            </Right>
          </ListItem>
        ))}
      </NativeBaseList>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  itemRightText: {
    fontStyle: 'italic',
    backgroundColor: material.brandInfo,
    color: '#fff',
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 2,
    paddingTop: 2,
    borderRadius: 8
  },
  itemLeftAndRight: {
    paddingTop: 0,
    height: '100%'
  },
  itemLeftAndRightIcon: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: material.brandPrimary
  },
  callButton: {
    height: 32,
    width: 32
  },
  callIcon: {
    padding: 0,
    borderRadius: 24,
    backgroundColor: 'transparent'
  },
  centerFlex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default List;
