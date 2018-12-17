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

const initialValues = () => ({
  ref: null
});

const validationSchema = Yup.object().shape({
  ref: Yup.object().shape({
    label: Yup.string().required(),
    value: Yup.string().required(),
    serviceId: Yup.string().required()
  })
});

const styles = theme => ({
  autocomplete: {
    marginTop: theme.spacing.unit
  }
});

class ImportOrganizationForm extends Component {
  static defaultProps = {
    remoteOrganizations: []
  };

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
    const { open, remoteOrganizations, classes } = this.props;

    const refOptions = remoteOrganizations.map(o => ({ label: o.name, value: o.id, serviceId: o._serviceId }));

    return (
      <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title" fullWidth>
        <DialogTitle id="form-dialog-title">Import Organization</DialogTitle>
        <Divider />
        <Formik
          initialValues={initialValues()}
          validationSchema={validationSchema}
          onSubmit={this.handleAccept}
          render={props => (
            <Fragment>
              <DialogContent>
                <form onSubmit={props.handleSubmit}>
                  <Field
                    name="ref"
                    component={Autocomplete}
                    className={classes.autocomplete}
                    options={refOptions}
                    placeholder="Search for organizations..."
                    textFieldProps={{ margin: 'dense' }}
                  />
                </form>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  Cancel
                </Button>
                <Button
                  disabled={!props.values.ref || !props.values.ref.value}
                  onClick={props.submitForm}
                  color="primary"
                >
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

export default withStyles(styles)(ImportOrganizationForm);
