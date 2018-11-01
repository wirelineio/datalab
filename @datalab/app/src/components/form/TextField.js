import React from 'react';

import MuiTextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';

export default function TextField({
  field,
  form: { touched, errors, isSubmitting },
  loading,
  InputProps = {},
  ...props
}) {
  const hasError = !!(touched[field.name] && errors[field.name]);

  const _InputProps = {
    ...InputProps,
    startAdornment: loading && (
      <InputAdornment position="start">
        <CircularProgress size={24} />
      </InputAdornment>
    )
  };

  return (
    <MuiTextField
      disabled={isSubmitting}
      InputProps={_InputProps}
      error={hasError}
      helperText={touched[field.name] && errors[field.name]}
      {...field}
      {...props}
    />
  );
}
