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

const initialValues = stage => ({
  id: stage ? stage.id : null,
  name: stage ? stage.name : ''
});

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters long.')
    .required('Name is required.')
});

export default class StageForm extends Component {
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
    const { open, stage } = this.props;

    return (
      <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title" fullWidth>
        <DialogTitle id="form-dialog-title">{stage ? 'Edit stage' : 'New stage'}</DialogTitle>
        <Divider />
        <Formik
          initialValues={initialValues(stage)}
          validationSchema={validationSchema}
          onSubmit={this.handleAccept}
          render={props => (
            <Fragment>
              <DialogContent>
                <form onSubmit={props.handleSubmit}>
                  <Field component={TextField} autoFocus margin="dense" name="name" label="Name" fullWidth />
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
