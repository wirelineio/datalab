import React, { Component, Fragment } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';

import { Formik, Field } from 'formik';
import * as Yup from 'yup';

import TextField from '../form/TextField';
import SubmitServices from '../form/SubmitServices';
// import Autocomplete from '../form/Autocomplete';
import RichText from '../editor/RichText';

const initialValues = (organization, stage) => ({
  id: organization.id || null,
  name: organization.name || '',
  stage: organization.stage ? organization.stage.id : stage && stage.id ? stage.id : '',
  url: organization.url || '',
  goals: organization.goals || ''
});

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters long.')
    .required('Name is required.'),
  url: Yup.string().url('The Website must be a valid url.'),
  goals: Yup.string(),
  stage: Yup.string()
});

const styles = theme => ({
  autocomplete: {
    marginTop: theme.spacing.unit
  }
});

class OrganizationForm extends Component {
  static defaultProps = {
    services: [],
    stages: [],
    organization: {}
  };

  constructor(props) {
    super(props);

    const { organization } = props;

    if (organization.ref) {
      this.state.serviceId = organization.ref.serviceId;
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
    const { organization, stage, stages, services, onSpellcheck, classes } = this.props;
    const { serviceId } = this.state;

    return (
      <Dialog open={true} onClose={this.handleClose} aria-labelledby="form-dialog-title" fullWidth>
        <DialogTitle id="form-dialog-title">{organization.id ? 'Edit organization' : 'New organization'}</DialogTitle>
        <Divider />
        <Formik
          initialValues={initialValues(organization, stage)}
          validationSchema={validationSchema}
          onSubmit={this.handleAccept}
          render={props => (
            <Fragment>
              <DialogContent>
                <form onSubmit={props.handleSubmit} autoComplete="off">
                  <Field component={TextField} autoFocus margin="dense" name="name" label="Name" fullWidth />
                  <Field component={TextField} margin="dense" name="url" label="Website" fullWidth />
                  <Field
                    component={RichText}
                    placeholder="Enter organization goals."
                    name="goals"
                    label="Goals"
                    onSpellcheck={onSpellcheck}
                  />
                  <Field
                    component={TextField}
                    name="stage"
                    label="Stage"
                    select
                    SelectProps={{
                      displayEmpty: true
                    }}
                    InputLabelProps={{ shrink: true }}
                    className={classes.autocomplete}
                    margin="dense"
                    fullWidth
                  >
                    {stages.map(({ name, id }) => (
                      <MenuItem key={id} value={id}>
                        {name}
                      </MenuItem>
                    ))}
                  </Field>
                </form>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  Cancel
                </Button>
                <SubmitServices
                  services={services}
                  serviceId={serviceId}
                  submitForm={serviceId => this.handleSubmit(serviceId, props)}
                />
              </DialogActions>
            </Fragment>
          )}
        />
      </Dialog>
    );
  }
}

export default withStyles(styles)(OrganizationForm);
