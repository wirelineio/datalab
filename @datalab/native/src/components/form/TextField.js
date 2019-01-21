import React, { Component } from 'react';
import { Label, Input, Icon as NBIcon } from 'native-base';
import debounce from 'lodash.debounce';

import { FieldWrapper, FieldItem, ErrorFieldHelper } from './common';
import SpellChecker from '../spellcheck/SpellChecker';

export default class TextField extends Component {
  state = {
    spellChecking: false,
    scErrors: [],
    scLoading: false
  };

  onSpellCheck = debounce(async value => {
    const { onSpellCheck = null } = this.props;

    if (onSpellCheck) {
      this.setState({ scLoading: true });
      const scErrors = await onSpellCheck(value);
      this.setState({ scErrors, scLoading: false });
    }
  }, 1000);

  onChangeText = value => {
    const {
      field,
      form: { setFieldValue }
    } = this.props;

    setFieldValue(field.name, value);

    this.onSpellCheck(value);
  };

  componentDidMount() {
    if (this.props.field.value && this.props.onSpellCheck) {
      this.onChangeText(this.props.field.value);
    }
  }

  onBlur = () => this.props.form.handleBlur(this.props.field.name);

  getRef = input => (this._input = input);

  render() {
    const {
      field,
      form: { touched, errors },
      label,
      multiline = false,
      rows = 1,
      onSpellCheck = null
    } = this.props;

    const hasError = !!(touched[field.name] && errors[field.name]);
    return (
      <FieldWrapper>
        <FieldItem floatingLabel error={hasError}>
          <Label>{label}</Label>
          <Input
            name={field.name}
            value={field.value}
            onChangeText={this.onChangeText}
            onBlur={this.onBlur}
            multiline={multiline}
            numberOfLines={rows}
            getRef={this.getRef}
            autoCorrect={!onSpellCheck}
          />
          {hasError && <NBIcon name="close-circle" />}
        </FieldItem>
        {hasError && <ErrorFieldHelper>{errors[field.name]}</ErrorFieldHelper>}
        {onSpellCheck && (
          <SpellChecker
            errors={this.state.scErrors}
            loading={this.state.scLoading}
            value={field.value}
            onFix={this.onChangeText}
          />
        )}
      </FieldWrapper>
    );
  }
}
