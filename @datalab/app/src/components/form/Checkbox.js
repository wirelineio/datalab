import React from 'react';
import { Field } from 'formik';

import { default as MuiCheckbox } from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 2
  }
});

function Checkbox({ name, label, color = 'primary', classes }) {
  return (
    <Field name={name}>
      {({ field, form }) => (
        <FormControlLabel
          className={classes.root}
          control={
            <MuiCheckbox
              checked={field.value}
              onChange={() => {
                form.setFieldValue(name, !field.value);
              }}
              color={color}
            />
          }
          label={label}
        />
      )}
    </Field>
  );
}

export default withStyles(styles)(Checkbox);
