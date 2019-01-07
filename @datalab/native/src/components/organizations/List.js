import React from 'react';
import { StyleSheet } from 'react-native';
import { List as NativeBaseList, ListItem, Left, Body, Right, Text } from 'native-base';
import { material } from '../../style/variables';
import { RoundedIcon } from '../Icon';
import { ScrollView } from 'react-native';
import { InfoText } from '../Text';

const List = props => {
  const { data, onItemPress } = props;
  return (
    <ScrollView>
      <NativeBaseList>
        {!data.length && (
          <ListItem avatar>
            <Body>
              <InfoText>No organizations to show.</InfoText>
            </Body>
          </ListItem>
        )}
        {data.map(({ id, stage, name, goals }, index) => (
          <ListItem key={index} avatar onPress={() => onItemPress(id)}>
            <Left style={styles.itemLeft}>
              <RoundedIcon name="group" size={32} backgroundColor={material.brandPrimary} color="#fff" />
            </Left>
            <Body>
              <Text>{name}</Text>
              <Text note>{goals}</Text>
            </Body>
            <Right>
              <Text note style={styles.itemRightText}>
                {stage ? stage.name : 'Uncategorized'}
              </Text>
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
  itemLeft: {
    paddingTop: 0,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default List;
