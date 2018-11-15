import React, { Component, Fragment } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import classnames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import { default as MuiCard } from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import RootRef from '@material-ui/core/RootRef';
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Collapse from '@material-ui/core/Collapse';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import blue from '@material-ui/core/colors/blue';

import Orgs from '../service-types/Orgs';

const styles = theme => ({
  card: {
    marginBottom: theme.spacing.unit * 2
  },
  actions: {
    display: 'flex'
  },
  expansionHeading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  cardContent: {
    padding: 0,
    '&:last-child': {
      paddingBottom: 0
    }
  },
  expansionPanel: {
    margin: 0
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  header: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 3}px`
  },
  action: {
    marginTop: 0
  },
  avatar: {
    marginLeft: -theme.spacing.unit * 2,
    marginRight: theme.spacing.unit
  },
  link: {
    textDecoration: 'none',
    color: blue[500],
    '&:hover': {
      color: blue[900]
    }
  },
  formLabel: {
    fontSize: '.8em'
  },
  formItem: {
    minHeight: '1.5em'
  }
});

class Card extends Component {
  state = {
    anchorEl: null,
    expanded: false
  };

  close = cb => {
    this.setState({ anchorEl: null }, cb);
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.close();
  };

  handleEditCard = () => {
    const { onEditCard } = this.props;
    this.close(() => {
      if (onEditCard) {
        onEditCard();
      }
    });
  };

  handleDeleteCard = () => {
    const { onDeleteCard } = this.props;
    this.close(() => {
      if (onDeleteCard) {
        onDeleteCard();
      }
    });
  };

  handleAddContact = () => {
    const { onAddContact } = this.props;
    this.close(() => {
      if (onAddContact) {
        onAddContact();
      }
    });
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  renderActionMenu() {
    const { id } = this.props;
    const { anchorEl } = this.state;

    const menuId = `${id}-action-menu`;

    return (
      <Fragment>
        <IconButton aria-owns={anchorEl ? menuId : undefined} aria-haspopup="true" onClick={this.handleClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu id={menuId} anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
          <MenuItem onClick={this.handleAddContact}>Add contact</MenuItem>
          <MenuItem onClick={this.handleEditCard}>Edit record</MenuItem>
          <MenuItem onClick={this.handleDeleteCard}>Delete record</MenuItem>
        </Menu>
      </Fragment>
    );
  }

  render() {
    const { classes, id, title, data, index, subheader, onEditContact, onDeleteContact } = this.props;
    const { expanded } = this.state;

    return (
      <Draggable draggableId={id} index={index} type="CARD">
        {(provided, snapshot) => (
          <RootRef rootRef={provided.innerRef}>
            <MuiCard
              className={classes.card}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              raised={snapshot.isDragging}
            >
              <CardHeader
                // onClick={this.handleExpandClick}
                avatar={
                  <IconButton
                    className={classnames(classes.expand, {
                      [classes.expandOpen]: expanded
                    })}
                    onClick={this.handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="Show more"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                }
                action={this.renderActionMenu()}
                title={title}
                subheader={subheader}
                className={classes.header}
                classes={{
                  avatar: classes.avatar,
                  action: classes.action
                }}
                titleTypographyProps={{ variant: 'subtitle2' }}
              />
              <Divider />
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <FormLabel className={classes.formLabel}>Website</FormLabel>
                  <Typography
                    component="a"
                    href={data.url}
                    target="blank"
                    className={classnames([classes.formItem, data.url && classes.link])}
                    variant="body2"
                    gutterBottom
                  >
                    {data.url}
                  </Typography>
                  <FormLabel className={classes.formLabel}>Goals</FormLabel>
                  <Typography className={classes.formItem} variant="body2" gutterBottom>
                    {data.goals}
                  </Typography>
                  <FormLabel className={classes.formLabel}>Contacts</FormLabel>
                  <Orgs
                    id={id}
                    contacts={data.contacts}
                    onEditContact={onEditContact}
                    onDeleteContact={onDeleteContact}
                  />
                </CardContent>
              </Collapse>
            </MuiCard>
          </RootRef>
        )}
      </Draggable>
    );
  }
}

export default withStyles(styles)(Card);
