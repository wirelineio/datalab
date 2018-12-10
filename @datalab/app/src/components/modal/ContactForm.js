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

  state = {
    openMenu: false,
    serviceId: null
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

  handleMenuToggle = () => {
    this.setState(state => ({
      openMenu: !state.openMenu
    }));
  };

  handleMenuSubmit = ({ serviceId, submitForm }) => {
    this.setState(
      {
        openMenu: false,
        serviceId
      },
      () => {
        submitForm();
      }
    );
  };

  renderMenu = ({ submitForm, values }) => {
    const { contactServices } = this.props;
    const { openMenu } = this.state;

    let service;
    let handle = this.handleMenuToggle;
    if (values.ref) {
      const { remoteContact } = values.ref;
      service = contactServices.find(s => s.id === remoteContact._serviceId);
      handle = submitForm;
    } else if (contactServices.length === 1) {
      service = contactServices[0];
      handle = this.handleMenuSubmit.bind(this, { serviceId: service.id, submitForm });
    }

    return (
      <Fragment>
        <Button
          buttonRef={node => {
            this.submitAnchorEl = node;
          }}
          aria-owns={openMenu ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handle}
          color="primary"
        >
          Save in{service && ` ${service.name}`}
        </Button>
        <Popper open={openMenu} anchorEl={this.submitAnchorEl} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="menu-list-grow"
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.handleMenuToggle}>
                  <MenuList>
                    {contactServices.map(s => (
                      <MenuItem key={s.id} onClick={this.handleMenuSubmit.bind(this, { serviceId: s.id, submitForm })}>
                        {s.name}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Fragment>
    );
  };

  render() {
    const { open, organization, contact, remoteContacts, classes } = this.props;
    const refOptions = remoteContacts.map(c => ({ label: c.name, value: c.id, remoteContact: c }));

    return (
      <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title" fullWidth>
        <DialogTitle id="form-dialog-title">{contact ? 'Edit contact' : 'New contact'}</DialogTitle>
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
                    <Field
                      disabled={!!ref}
                      component={TextField}
                      className={classes.textField}
                      margin="dense"
                      name="name"
                      label="Name"
                    />
                    <Field
                      disabled={!!ref}
                      component={TextField}
                      className={classes.textField}
                      margin="dense"
                      type="email"
                      name="email"
                      label="Email"
                    />
                    <Field
                      disabled={!!ref}
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
                  {this.renderMenu({ submitForm: props.submitForm, values: props.values })}
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
