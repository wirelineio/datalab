import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class FormStage extends Component {
  state = {
    value: ''
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  handleClose = () => {
    const { onClose } = this.props;
    this.setState({ value: '' }, () => {
      onClose(false);
    });
  };

  handleAccept = () => {
    const { onClose } = this.props;
    const { value } = this.state;
    this.setState({ value: '' }, () => {
      onClose(value.length > 0 ? value : null);
    });
  };

  render() {
    const { open } = this.props;

    return (
      <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Column</DialogTitle>
        <DialogContent>
          <DialogContentText>Select a name for the new column</DialogContentText>
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
