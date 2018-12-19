import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { withStyles } from '@material-ui/core/styles';

import { Formik, Field } from 'formik';
import * as Yup from 'yup';

import TextField from '../form/TextField';
import Autocomplete from '../form/Autocomplete';
import SubmitServices from '../form/SubmitServices';

const initialValues = ({ organization, contact, refOptions }) => ({
  id: contact.id,
  name: contact.name || '',
  email: contact.email || '',
  phone: contact.phone || '',
  organizationId: organization ? organization.id : null,
  ref: contact.ref ? refOptions.find(o => o.value === contact.ref.id) : null
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
  static defaultProps = {
    contactServices: [],
    contact: {},
    remoteContacts: []
  };

  constructor(props) {
    super(props);

    const { contact } = props;

    if (contact.ref) {
      this.state.serviceId = contact.ref.serviceId;
    }
  }

  state = {
    serviceId: undefined
  };

  handleClose = () => {
    const { onClose } = this.props;
    onClose(false);
  };

  handleAccept = (values, actions) => {
    const { onClose } = this.props;
    const { serviceId } = this.state;
    onClose(values, serviceId);
    actions.setSubmitting(false);
  };

  handleSubmit = (serviceId, { submitForm }) => {
    this.setState({ serviceId }, () => {
      submitForm();
    });
  };

  render() {
    const { organization, contact, remoteContacts, classes, contactServices } = this.props;
    const { serviceId } = this.state;

    const refOptions = remoteContacts.map(c => ({ label: c.name, value: c.id, remoteContact: c }));
    const isEdit = !!contact.id;

    return (
      <Dialog open={true} onClose={this.handleClose} aria-labelledby="form-dialog-title" fullWidth>
        <DialogTitle id="form-dialog-title">{isEdit ? 'Edit contact' : 'New contact'}</DialogTitle>
        <Divider />
        <Formik
          initialValues={initialValues({ organization, contact, refOptions })}
          validationSchema={validationSchema}
          onSubmit={this.handleAccept}
          render={props => {
            const {
              values: { ref }
            } = props;
            return (
              <Fragment>
                <DialogContent className={classes.dialogContent}>
                  <form onSubmit={props.handleSubmit}>
                    {!isEdit && (
                      <Field
                        name="ref"
                        component={Autocomplete}
                        className={classes.autocomplete}
                        options={refOptions}
                        placeholder="Search for contacts..."
                        textFieldProps={{ margin: 'dense' }}
                        onAfterChange={(value, { form }) => {
                          if (value && value.remoteContact) {
                            const { remoteContact } = value;
                            form.setFieldValue('name', remoteContact.name);
                            form.setFieldValue('email', remoteContact.email || '');
                            form.setFieldValue('phone', remoteContact.phone || '');
                          }
                        }}
                        isClearable
                      />
                    )}
                    <Field
                      disabled={!isEdit && !!ref}
                      component={TextField}
                      className={classes.textField}
                      margin="dense"
                      name="name"
                      label="Name"
                    />
                    <Field
                      disabled={!isEdit && !!ref}
                      component={TextField}
                      className={classes.textField}
                      margin="dense"
                      type="email"
                      name="email"
                      label="Email"
                    />
                    <Field
                      disabled={!isEdit && !!ref}
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
                  <SubmitServices
                    services={contactServices}
                    serviceId={serviceId}
                    submitForm={serviceId => this.handleSubmit(serviceId, props)}
                  />
                </DialogActions>
              </Fragment>
            );
          }}
        />
      </Dialog>
    );
  }
}

export default withStyles(styles)(ContactForm);
