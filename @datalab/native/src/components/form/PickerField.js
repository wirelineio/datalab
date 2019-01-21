import { FieldWrapper, FieldItem, ErrorFieldHelper } from './common';
import { Picker, Icon, Label } from 'native-base';
import React from 'react';

const PickerField = ({
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

export default PickerField;
