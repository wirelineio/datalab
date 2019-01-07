import React from 'react';
import { View } from 'react-native';
import { Item, Label, Input, Icon, Text, Picker } from 'native-base';
import styled from 'styled-components/native';

import { material } from '../style/variables';

const FieldWrapper = styled(View)`
  margin-bottom: 8px;
  margin-top: 0px;
  margin-left: 0px;
  padding: 0px;
`;

const FieldHelper = styled(Text)`
  margin: 0;
  margin-left: 8px;
`;

const ErrorFieldHelper = styled(FieldHelper)`
  color: ${material.brandDanger};
`;

const FieldItem = styled(Item)`
  margin: 8px;
  margin-left: 8px;
  margin-bottom: 0px;
`;

export const TextField = ({
  field,
  form: { touched, errors, setFieldValue, handleBlur },
  label,
  multiline = false,
  rows = 1
}) => {
  const hasError = !!(touched[field.name] && errors[field.name]);
  return (
    <FieldWrapper>
      <FieldItem floatingLabel error={hasError}>
        <Label>{label}</Label>
        <Input
          name={field.name}
          value={field.value}
          onChangeText={value => setFieldValue(field.name, value)}
          onBlur={() => handleBlur(field.name)}
          multiline={multiline}
          numberOfLines={rows}
        />
        {hasError && <Icon name="close-circle" />}
      </FieldItem>
      {hasError && <ErrorFieldHelper>{errors[field.name]}</ErrorFieldHelper>}
    </FieldWrapper>
  );
};

export const TextareaField = props => <TextField {...props} multiline />;

export const PickerField = ({
  field,
  form: { touched, errors, setFieldValue },
  label,
  options = [],
  valueField = 'value',
  labelField = 'label'
}) => {
  const hasError = !!(touched[field.name] && errors[field.name]);
  return (
    <FieldWrapper>
      <FieldItem picker error={hasError}>
        <Label style={{ color: '#575757' }}>{label}</Label>
        <Picker
          mode="dropdown"
          iosIcon={<Icon name="ios-arrow-down-outline" />}
          style={{ width: undefined }}
          placeholder={label}
          placeholderStyle={{ color: '#575757' }}
          placeholderIconColor="#007aff"
          selectedValue={field.value}
          onValueChange={value => setFieldValue(field.name, value)}
        >
          {options.map((option, index) => (
            <Picker.Item key={index} label={option[labelField]} value={option[valueField]} />
          ))}
        </Picker>
        {hasError && <Icon name="close-circle" />}
      </FieldItem>
      {hasError && <ErrorFieldHelper>{errors[field.name]}</ErrorFieldHelper>}
    </FieldWrapper>
  );
};
