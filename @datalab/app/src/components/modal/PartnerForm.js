import React, { Component, Fragment } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';

import { Formik, Field } from 'formik';
import * as Yup from 'yup';

import TextField from '../form/TextField';
// import Autocomplete from '../form/Autocomplete';
import RichText from '../editor/RichText';

const initialValues = (partner, stage) => ({
  id: partner ? partner.id : null,
  name: partner ? partner.name : '',
  stage: partner && partner.stage ? partner.stage.id : stage && stage.id ? stage.id : '',
  url: partner ? partner.url || '' : '',
  goals: partner ? partner.goals || '' : ''
});

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters long.')
    .required('Name is required.'),
  url: Yup.string().url('The Website must be a valid url.'),
  goals: Yup.string(),
  stage: Yup.string()
});

const styles = theme => ({
  autocomplete: {
    marginTop: theme.spacing.unit
  }
});

class PartnerForm extends Component {
  handleClose = () => {
    const { onClose } = this.props;
    onClose(false);
  };

  handleAccept = (values, actions) => {
    const { onClose } = this.props;
    onClose(values);
    actions.setSubmitting(false);
  };

  render() {
    const { open, partner, stage, stages = [], onSpellcheck, classes } = this.props;

    return (
      <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title" fullWidth>
        <DialogTitle id="form-dialog-title">{partner ? 'Edit partner' : 'New partner'}</DialogTitle>
        <Divider />
        <Formik
          initialValues={initialValues(partner, stage)}
          validationSchema={validationSchema}
          onSubmit={this.handleAccept}
          render={props => (
            <Fragment>
              <DialogContent>
                <form onSubmit={props.handleSubmit} autoComplete="off">
                  <Field component={TextField} autoFocus margin="dense" name="name" label="Name" fullWidth />
                  <Field component={TextField} margin="dense" name="url" label="Website" fullWidth />
                  <Field
                    component={RichText}
                    placeholder="Enter partner goals."
                    name="goals"
                    label="Goals"
                    onSpellcheck={onSpellcheck}
                  />
                  <Field
                    component={TextField}
                    name="stage"
                    label="Stage"
                    select
                    SelectProps={{
                      displayEmpty: true
                    }}
                    InputLabelProps={{ shrink: true }}
                    className={classes.autocomplete}
                    margin="dense"
                    fullWidth
                  >
                    {stages.map(({ name, id }) => (
                      <MenuItem key={id} value={id}>
                        {name}
                      </MenuItem>
                    ))}
                  </Field>
                </form>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={props.submitForm} color="primary">
                  Save
                </Button>
              </DialogActions>
            </Fragment>
          )}
        />
      </Dialog>
    );
  }
}

export default withStyles(styles)(PartnerForm);
