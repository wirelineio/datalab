import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

import { Formik, Field } from 'formik';
import * as Yup from 'yup';

import TextField from '../form/TextField';

const initialValues = (partner, contact) => ({
  id: contact.id,
  name: contact.name || '',
  email: contact.email || '',
  phone: contact.phone || '',
  partnerId: partner ? partner.id : null
});

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters long.')
    .required('Name is required.'),
  email: Yup.string().email(),
  phone: Yup.string()
});

const styles = theme => ({
  textField: {
    width: '100%'
  },
  dialogContent: {
    paddingTop: '0 !important',
    overflow: 'auto'
  },
  autocomplete: {
    marginTop: theme.spacing.unit
  }
});

class ContactForm extends Component {
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
    const { open, partner, contact = {}, classes } = this.props;

    return (
      <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title" fullWidth>
        <DialogTitle id="form-dialog-title">{contact ? 'Edit contact' : 'New contact'}</DialogTitle>
        <Divider />
        <Formik
          initialValues={initialValues(partner, contact)}
          validationSchema={validationSchema}
          onSubmit={this.handleAccept}
          render={props => (
            <Fragment>
              <DialogContent className={classes.dialogContent}>
                <form onSubmit={props.handleSubmit}>
                  <Field component={TextField} className={classes.textField} margin="dense" name="name" label="Name" />
                  <Field
                    component={TextField}
                    className={classes.textField}
                    margin="dense"
                    type="email"
                    name="email"
                    label="Email"
                  />
                  <Field
                    component={TextField}
                    className={classes.textField}
                    margin="dense"
                    name="phone"
                    label="Phone"
                  />
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

export default withStyles(styles)(ContactForm);
