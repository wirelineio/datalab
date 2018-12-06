import React from 'react';
import { StyleSheet, Linking } from 'react-native';
import { List as NativeBaseList, ListItem, Left, Body, Right, Text, Button } from 'native-base';
import { material } from '../../style/variables';
import Icon from '../Icon';

const List = props => {
  const { data, onItemPress } = props;

  return (
    <NativeBaseList>
      {data.map(({ id, name, phone, email }, index) => (
        <ListItem key={index} avatar onPress={() => onItemPress(id)}>
          <Left style={[styles.centerFlex, styles.itemLeftAndRight]}>
            <Icon name="person" size={16} color="#fff" style={styles.itemLeftAndRightIcon} />
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
