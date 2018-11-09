import React, { Component, Fragment } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import classnames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import { default as MuiCard } from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
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
  link: {
    textDecoration: 'none',
    color: blue[500],
    '&:hover': {
      color: blue[900]
    }
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
    const { id, classes } = this.props;
    const { anchorEl, expanded } = this.state;

    const menuId = `${id}-action-menu`;

    return (
      <Fragment>
        <IconButton aria-owns={anchorEl ? menuId : undefined} aria-haspopup="true" onClick={this.handleClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu id={menuId} anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
          <MenuItem onClick={this.handleEditCard}>Edit record</MenuItem>
          <MenuItem onClick={this.handleAddContact}>Add contact</MenuItem>
        </Menu>
      </Fragment>
    );
  }

  render() {
    const { classes, id, title, data, index, subheader } = this.props;
    const { expanded } = this.state;

    return (
      <Draggable draggableId={id} index={index}>
        {(provided, snapshot) => (
          <RootRef rootRef={provided.innerRef}>
            <MuiCard
              className={classes.card}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              raised={snapshot.isDragging}
            >
              <CardHeader
                onClick={this.handleExpandClick}
                action={this.renderActionMenu()}
                title={title}
                subheader={subheader}
                className={classes.header}
                titleTypographyProps={{ variant: 'subtitle2' }}
              />
              <Divider />
              <CardContent>
                <Orgs contacts={data.contacts} />
              </CardContent>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography
                    component="a"
                    href={data.url}
                    target="blank"
                    className={classes.link}
                    variant="body2"
                    gutterBottom
                  >
                    {data.url}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {data.goals}
                  </Typography>
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
