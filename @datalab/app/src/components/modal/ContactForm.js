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

const initialValues = contact => {
  const initial = {
    isNew: false,
    isEdit: false,
    id: null,
    name: '',
    email: '',
    phone: '',
    company: undefined
  };

  if (contact) {
    return {
      ...initial,
      isEdit: true,
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: {
        value: contact.company.id,
        label: contact.company.name,
        __isNew__: false
      },
      contacts: []
    };
  }

  return initial;
};

const toValueLabel = c => ({
  value: c.id,
  label: c.name
});

const onlyForNewOrEdit = then =>
  Yup.mixed().when(['isNew', 'isEdit'], {
    is: (isNew, isEdit) => isNew || isEdit,
    then
  });

const validationSchema = Yup.object().shape({
  isNew: Yup.bool(),
  isEdit: Yup.bool(),
  name: onlyForNewOrEdit(
    Yup.string()
      .min(3, 'Name must be at least 3 characters long.')
      .required('Name is required.')
  ),
  email: onlyForNewOrEdit(
    Yup.string()
      .email()
      .required('Email is required.')
  ),
  phone: onlyForNewOrEdit(Yup.string().required('Phone is required.')),
  company: Yup.object().shape({
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
    this.setState(initialState, async () => {
      await onClose(false);
    });
  };

  handleAccept = async (values, actions) => {
    const { onClose, stageId } = this.props;

    let result = values.contacts.map(d => ({
      id: d.value,
      stageId
    }));

    if (values.isNew || values.isEdit) {
      const contact = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        companyId: values.company.value,
        stageId
      };

      if (values.isNew) {
        // to update multiple
        result.push(contact);
      } else {
        // to just edit one contact
        contact.id = values.id;
        result = [contact];
      }
    }

    if (result.length === 0) {
      await onClose(false);
    } else {
      await onClose({ contacts: result, company: values.company });
    }

    this.setState(initialState, () => {
      actions.setSubmitting(false);
    });
  };

  render() {
    const { open, companies = [], contact, classes } = this.props;
    let { allContacts } = this.state;

    const options = companies.map(toValueLabel);
    allContacts = allContacts.map(toValueLabel);

    return (
      <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title" className={classes.root}>
        <DialogTitle id="form-dialog-title">{contact ? 'Edit contact' : 'New card'}</DialogTitle>
        <Divider />
        <Formik
          initialValues={initialValues(contact)}
          validationSchema={validationSchema}
          onSubmit={this.handleAccept}
          render={props => (
            <Fragment>
              <DialogContent className={classes.dialogContent}>
                <form onSubmit={props.handleSubmit}>
                  {!props.values.isEdit && (
                    <Fragment>
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
                    </Fragment>
                  )}
                  <Field
                    component={TextField}
                    disabled={!props.values.isEdit && !props.values.isNew}
                    className={classes.textField}
                    margin="dense"
                    name="name"
                    label="Name"
                  />
                  <Field
                    component={TextField}
                    disabled={!props.values.isEdit && !props.values.isNew}
                    className={classes.textField}
                    margin="dense"
                    type="email"
                    name="email"
                    label="Email"
                  />
                  <Field
                    component={TextField}
                    disabled={!props.values.isEdit && !props.values.isNew}
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
