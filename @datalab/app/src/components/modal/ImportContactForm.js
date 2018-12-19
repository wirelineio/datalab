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

import Autocomplete from '../form/Autocomplete';

const initialValues = {
  contact: undefined
};

const validationSchema = Yup.object().shape({
  contact: Yup.object()
    .nullable(true)
    .required('Choose a contact to import.')
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

class ImportContactForm extends Component {
  static defaultProps = {
    contactServices: [],
    remoteContacts: []
  };

  handleClose = () => {
    const { onClose } = this.props;
    onClose(false);
  };

  onSubmit = async ({ contact }, actions) => {
    actions.setSubmitting(true);
    const { onClose } = this.props;
    await onClose(contact.remoteContact);
    actions.setSubmitting(false);
  };

  buildOptions = () => {
    const { contactServices, remoteContacts } = this.props;
    return remoteContacts.map(c => {
      const serviceName = contactServices.find(s => s.id === c._serviceId).name;
      // const serviceNameInitials = serviceName
      //   .split('-')
      //   .map(i => i.charAt(0).toUpperCase())
      //   .join('');
      return {
        label: `${serviceName} • ${c.name}`,
        value: c.id,
        remoteContact: c
      };
    });
  };

  render() {
    const { classes } = this.props;
    const options = this.buildOptions();

    return (
      <Dialog open={true} onClose={this.handleClose} aria-labelledby="form-dialog-import-contact" fullWidth>
        <DialogTitle id="form-dialog-import-contact">Import contact</DialogTitle>
        <Divider />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={this.onSubmit}
          render={({ handleSubmit, isSubmitting }) => {
            return (
              <Fragment>
                <form onSubmit={handleSubmit}>
                  <DialogContent className={classes.dialogContent}>
                    <Field
                      name="contact"
                      component={Autocomplete}
                      className={classes.autocomplete}
                      options={options}
                      placeholder="Search for contacts..."
                      textFieldProps={{ margin: 'dense' }}
                      isClearable
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleClose} disabled={isSubmitting}>
                      Cancel
                    </Button>
                    <Button type="submit" color="primary" disabled={isSubmitting}>
                      Import
                    </Button>
                  </DialogActions>
                </form>
              </Fragment>
            );
          }}
        />
      </Dialog>
    );
  }
}

export default withStyles(styles)(ImportContactForm);
