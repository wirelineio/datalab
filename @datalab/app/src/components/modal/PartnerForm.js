import React, { Component, Fragment } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';

import { Formik, Field } from 'formik';
import * as Yup from 'yup';

import TextField from '../form/TextField';

const initialValues = (partner, stage) => ({
  id: partner ? partner.id : null,
  name: partner ? partner.name : '',
  stageId: partner ? partner.stageId : stage ? stage.id : null,
  url: partner ? partner.url || '' : '',
  goals: partner ? partner.goals || '' : ''
});

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters long.')
    .required('Name is required.'),
  url: Yup.string().url('The Website must be a valid url.'),
  goals: Yup.string()
});

export default class PartnerForm extends Component {
  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  handleClose = () => {
    const { onClose } = this.props;
    this.setState({ value: '' }, () => {
      onClose(false);
    });
  };

  handleAccept = (values, actions) => {
    const { onClose } = this.props;
    onClose(values);
    actions.setSubmitting(false);
  };

  render() {
    const { open, partner, stage } = this.props;

    return (
      <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{partner ? 'Edit partner' : 'New partner'}</DialogTitle>
        <Divider />
        <Formik
          initialValues={initialValues(partner, stage)}
          validationSchema={validationSchema}
          onSubmit={this.handleAccept}
          render={props => (
            <Fragment>
              <DialogContent>
                <form onSubmit={props.handleSubmit}>
                  <Field component={TextField} autoFocus margin="dense" name="name" label="Name" fullWidth />
                  <Field component={TextField} margin="dense" name="url" label="Website" fullWidth />
                  <Field component={TextField} margin="dense" name="goals" label="Goals" fullWidth multiline rows="3" />
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
