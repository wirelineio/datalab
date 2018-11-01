import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

import { Formik, Field } from 'formik';
import * as Yup from 'yup';

import TextField from '../form/TextField';
import Autocomplete from '../form/Autocomplete';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters long.')
    .required('Name is required.'),
  email: Yup.string()
    .email()
    .required('Email is required.'),
  phone: Yup.string().required('Phone is required.'),
  company: Yup.object()
    .shape({
      label: Yup.string().required(),
      value: Yup.string().required()
    })
    .required('Company is required.')
});

const initialValues = {
  name: '',
  email: '',
  phone: '',
  company: null
};

const initialState = {
  companySelected: null,
  contactsToCard: []
};

const styles = theme => ({
  root: {
    minWidth: 200
  },
  textField: {
    width: '100%'
  },
  dialogContent: {
    paddingTop: '0 !important'
  },
  autocomplete: {
    marginTop: theme.spacing.unit
  }
});

class ContactForm extends Component {
  state = initialState;

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  handleClose = () => {
    const { onClose } = this.props;
    this.setState(initialState, () => {
      onClose(false);
    });
  };

  handleAccept = () => {
    const { onClose } = this.props;
    const { companySelected, contacts } = this.state;
    this.setState(initialState, () => {
      onClose(companySelected && contacts.length ? { companySelected, contacts } : null);
    });
  };

  render() {
    const { open, companies = [], contacts = [], stageId, classes } = this.props;

    const options = companies.map(c => ({
      value: c.id,
      label: c.name
    }));

    return (
      <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title" className={classes.root}>
        <DialogTitle id="form-dialog-title">New card</DialogTitle>
        <Divider />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              actions.setSubmitting(false);
            }, 1000);
          }}
          render={props => (
            <form onSubmit={props.handleSubmit}>
              <DialogContent className={classes.dialogContent}>
                <Field
                  name="company"
                  component={Autocomplete}
                  className={classes.autocomplete}
                  options={options}
                  placeholder="Partner..."
                  textFieldProps={{ margin: 'dense' }}
                />
                <Field component={TextField} className={classes.textField} margin="dense" name="name" label="Name" />
                <Field
                  component={TextField}
                  className={classes.textField}
                  margin="dense"
                  type="email"
                  name="email"
                  label="Email"
                />
                <Field component={TextField} className={classes.textField} margin="dense" name="phone" label="Phone" />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Save
                </Button>
              </DialogActions>
            </form>
          )}
        />
      </Dialog>
    );
  }
}

export default withStyles(styles)(ContactForm);
