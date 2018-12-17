import React, { Component } from 'react';

import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import ImportIcon from '@material-ui/icons/ImportContacts';

const styles = () => ({
  root: {},
  actions: {
    maxWidth: 100
  },
  centered: {
    textAlign: 'center'
  },
  addContactButton: {
    position: 'absolute',
    bottom: 20,
    left: '48%'
  },
  importContactButton: {
    position: 'absolute',
    bottom: 20,
    left: '52%'
  }
});

class List extends Component {
  render() {
    const { contacts, classes, onEditContact, onAddContact, onImportContact } = this.props;

    return (
      <div>
        <Table className={classes.root}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.actions}>Actions</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map(contact => {
              const { id, name, email, phone } = contact;
              return (
                <TableRow hover tabIndex={-1} key={id}>
                  <TableCell padding="checkbox">
                    <IconButton onClick={() => onEditContact(contact)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    {/* <IconButton color="secondary" onClick={() => null}>
                      <DeleteIcon fontSize="small" />
                    </IconButton> */}
                  </TableCell>
                  <TableCell>{name}</TableCell>
                  <TableCell>
                    <a href={`mailto:${email}`}>{email}</a>
                  </TableCell>
                  <TableCell>{phone}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Tooltip title="Create contact">
          <Fab color="primary" aria-label="Create" className={classes.addContactButton} onClick={onAddContact}>
            <AddIcon />
          </Fab>
        </Tooltip>
        <Tooltip title="Import contact">
          <Fab color="primary" aria-label="Import" className={classes.importContactButton} onClick={onImportContact}>
            <ImportIcon />
          </Fab>
        </Tooltip>
      </div>
    );
  }
}

export default withStyles(styles)(List);
