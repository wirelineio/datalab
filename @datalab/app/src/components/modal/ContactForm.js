import React, { Component } from 'react';
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
import Autocomplete from '../form/Autocomplete';
import Checkbox from '../form/Checkbox';

const initialValues = {
  isNew: false,
  name: '',
  email: '',
  phone: '',
  company: null
};

const toValueLabel = c => ({
  value: c.id,
  label: c.name
});

const onlyForNew = then =>
  Yup.mixed().when('isNew', {
    is: true,
    then
  });

const validationSchema = Yup.object().shape({
  isNew: Yup.bool(),
  name: onlyForNew(
    Yup.string()
      .min(3, 'Name must be at least 3 characters long.')
      .required('Name is required.')
  ),
  email: onlyForNew(
    Yup.string()
      .email()
      .required('Email is required.')
  ),
  phone: onlyForNew(Yup.string().required('Phone is required.')),
  company: Yup.object()
    .shape({
      label: Yup.string().required(),
      value: Yup.string().required()
    })
    .required('Company is required.'),
  contacts: Yup.array().of(
    Yup.object().shape({
      label: Yup.string().required(),
      value: Yup.string().required()
    })
  )
});

const initialState = {
  allContacts: []
};

const styles = theme => ({
  textField: {
    width: '100%'
  },
  dialogContent: {
    paddingTop: '0 !important',
    minWidth: 200
  },
  autocomplete: {
    marginTop: theme.spacing.unit
  }
});

class ContactForm extends Component {
  state = initialState;

  updateContacts = ({ value }, { form }) => {
    const { contacts, stageId } = this.props;

    const allContacts = contacts.filter(c => !c.company || c.company.id === value);

    this.setState(
      {
        allContacts
      },
      () => {
        form.setFieldValue('contacts', allContacts.filter(c => c.stage && c.stage.id === stageId).map(toValueLabel));
      }
    );
  };

  handleClose = () => {
    const { onClose } = this.props;
    this.setState(initialState, () => {
      onClose(false);
    });
  };

  handleAccept = async (values, actions) => {
    const { onClose, stageId } = this.props;
    const { selectedContacts } = this.state;

    const result = selectedContacts;

    if (values.isNew) {
      result.push({
        name: values.name,
        email: values.email,
        phone: values.phone,
        companyId: values.company.value,
        stageId
      });
    }

    await onClose(result);

    this.setState(initialState, () => {
      actions.setSubmitting(false);
    });
  };

  render() {
    const { open, companies = [], classes } = this.props;
    let { allContacts } = this.state;

    const options = companies.map(toValueLabel);
    allContacts = allContacts.map(toValueLabel);

    return (
      <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title" className={classes.root}>
        <DialogTitle id="form-dialog-title">New card</DialogTitle>
        <Divider />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={this.handleAccept}
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
                  onAfterChange={this.updateContacts}
                />
                <Field
                  name="contacts"
                  isMulti
                  component={Autocomplete}
                  className={classes.autocomplete}
                  options={allContacts}
                  placeholder="Contacts..."
                  textFieldProps={{ margin: 'dense' }}
                />
                <Checkbox name="isNew" label="Add new contact" />
                <Field
                  component={TextField}
                  disabled={!props.values.isNew}
                  className={classes.textField}
                  margin="dense"
                  name="name"
                  label="Name"
                />
                <Field
                  component={TextField}
                  disabled={!props.values.isNew}
                  className={classes.textField}
                  margin="dense"
                  type="email"
                  name="email"
                  label="Email"
                />
                <Field
                  component={TextField}
                  disabled={!props.values.isNew}
                  className={classes.textField}
                  margin="dense"
                  name="phone"
                  label="Phone"
                />
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
