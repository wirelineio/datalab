import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const initialState = {
  companySelected: null,
  contactsToCard: [],
  newContact: {
    name: '',
    email: '',
    phone: ''
  }
};

export default class ContactForm extends Component {
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
    const { open, companies = [], contacts = [] } = this.props;

    return (
      <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">New card</DialogTitle>
        <DialogContent>
          <DialogContentText>Select the company and the contacts for the new card:</DialogContentText>
          <TextField autoFocus margin="dense" id="name" label="Name" fullWidth onChange={this.handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleAccept} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
