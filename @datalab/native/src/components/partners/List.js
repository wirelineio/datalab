import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { List as NativeBaseList, ListItem, Left, Body, Right, Text } from 'native-base';
import { material } from '../../style/variables';

const Icon = ({ name }) => (
  <View>
    <MaterialIcons name={name} size={16} color="#fff" style={styles.itemLeftIcon} />
  </View>
);

const List = props => {
  const { data, onItemPress } = props;
  return (
    <NativeBaseList>
      {data.map(({ id, stage, name, goals }, index) => (
        <ListItem key={index} avatar onPress={() => onItemPress(id)}>
          <Left style={styles.itemLeft}>
            <Icon name="person" />
          </Left>
          <Body>
            <Text>{name}</Text>
            <Text note>{goals}</Text>
          </Body>
          <Right>
            <Text note style={styles.itemRightText}>
              {stage || 'Uncategorized'}
            </Text>
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
  itemLeft: {
    paddingTop: 0,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemLeftIcon: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: '#3f51b5'
  }
});

export default List;
