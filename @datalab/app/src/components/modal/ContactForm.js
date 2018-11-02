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
import Autocomplete from '../form/Autocomplete';
import Checkbox from '../form/Checkbox';

const initialValues = {
  isNew: false,
  name: '',
  email: '',
  phone: '',
  company: undefined
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
      label: Yup.string(),
      value: Yup.string().required('The partner is required.'),
      __isNew__: Yup.bool()
    }),
  contacts: Yup.array().of(
    Yup.object().shape({
      label: Yup.string().required(),
      value: Yup.string().required(),
      deleteable: Yup.bool()
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
    minWidth: 200,
    overflow: 'auto'
  },
  autocomplete: {
    marginTop: theme.spacing.unit
  }
});

class ContactForm extends Component {
  state = initialState;

  updateContacts = ({ value }, { form }) => {
    const { contacts, stageId } = this.props;

    const allContacts = contacts.filter(c => c.company && c.company.id === value);

    this.setState(
      {
        allContacts
      },
      () => {
        form.setFieldValue('contacts', allContacts.filter(c => c.stage && c.stage.id === stageId).map(toValueLabel));
      }
    );
  };

  allowDeleteNewOnes = (value, { field }) => {
    const newOne = value.findIndex(l => !field.value.find(r => l.value === r.value));
    if (newOne !== -1) {
      value[newOne].deleteable = true;
    }
    return value;
  };

  handleClose = () => {
    const { onClose } = this.props;
    this.setState(initialState, () => {
      onClose(false);
    });
  };

  handleAccept = async (values, actions) => {
    const { onClose, stageId } = this.props;

    const result = values.contacts.map(d => ({
      id: d.value,
      stageId
    }));

    if (values.isNew) {
      result.push({
        name: values.name,
        email: values.email,
        phone: values.phone,
        companyId: values.company.value,
        stageId
      });
    }

    await onClose({ contacts: result, company: values.company });

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
            <Fragment>
              <DialogContent className={classes.dialogContent}>
                <form onSubmit={props.handleSubmit}>
                  <Field
                    name="company"
                    isCreatable
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
                    isClearable={false}
                    backspaceRemovesValue={false}
                    component={Autocomplete}
                    className={classes.autocomplete}
                    options={allContacts}
                    placeholder="Contacts..."
                    textFieldProps={{ margin: 'dense' }}
                    onBeforeChange={this.allowDeleteNewOnes}
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
