import React, { Component } from 'react';

import Fab from '@material-ui/core/Fab';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

const styles = theme => ({
  root: {},
  actions: {
    maxWidth: 100
  },
  organizations: {
    width: '20%'
  },
  contacts: {
    width: '30%'
  },
  chip: {
    margin: theme.spacing.unit / 2
  },
  addOrganizationButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%'
  }
});

class List extends Component {
  render() {
    const { organizations, classes, onAddOrganization, onEditOrganization, onDeleteOrganization } = this.props;

    return (
      <div>
        <Table className={classes.root}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.actions}>Actions</TableCell>
              <TableCell className={classes.organizations}>Organization</TableCell>
              <TableCell className={classes.contacts}>Contacts</TableCell>
              <TableCell>Website</TableCell>
              <TableCell>Goals</TableCell>
              <TableCell>Stage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {organizations.map(organization => {
              const { id, name, url, goals, stage, contacts } = organization;
              return (
                <TableRow hover tabIndex={-1} key={id}>
                  <TableCell padding="checkbox">
                    <IconButton onClick={() => onEditOrganization(organization)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => onDeleteOrganization(organization)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                  <TableCell>{name}</TableCell>
                  <TableCell>
                    {contacts.map(({ name }) => (
                      <Chip key={name} label={name} className={classes.chip} />
                    ))}
                  </TableCell>
                  <TableCell>{url}</TableCell>
                  <TableCell>{goals}</TableCell>
                  <TableCell>{stage ? stage.name : ''}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Tooltip title="Add Organization">
          <Fab color="primary" aria-label="Add" className={classes.addOrganizationButton} onClick={onAddOrganization}>
            <AddIcon />
          </Fab>
        </Tooltip>
      </div>
    );
  }
}

export default withStyles(styles)(List);
