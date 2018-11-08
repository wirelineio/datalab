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

import Messaging from '../service-types/Messaging';
import Tasks from '../service-types/Tasks';
//import Orgs from '../service-types/Orgs';

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

const Services = ({ classes, messages, tasks, toggleTask }) => (
  <Fragment>
    {tasks && (
      <ExpansionPanel className={classes.expansionPanel}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Tasks</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Tasks tasks={tasks} toggleTask={toggleTask} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )}
    {messages && (
      <ExpansionPanel className={classes.expansionPanel}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Messages</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Messaging messages={messages} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )}
  </Fragment>
);

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

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  renderActionMenu() {
    const { id, classes } = this.props;
    const { anchorEl, expanded } = this.state;

    const menuId = `${id}-action-menu`;

    return (
      <Fragment>
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
        <IconButton aria-owns={anchorEl ? menuId : undefined} aria-haspopup="true" onClick={this.handleClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu id={menuId} anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
          <MenuItem onClick={this.handleEditCard}>Edit record</MenuItem>
        </Menu>
      </Fragment>
    );
  }

  render() {
    const { classes, id, title, data, contacts, index, subheader, messages, tasks, toggleTask } = this.props;
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
                action={this.renderActionMenu()}
                title={title}
                subheader={subheader}
                className={classes.header}
                titleTypographyProps={{ variant: 'subtitle2' }}
              />
              <Divider />
              {/*<CardContent>
              <Orgs contacts={contacts} onEdit={onEditContact} onDelete={onDeleteContact} />
            </CardContent>*/}
              <CardContent className={classes.cardContent}>
                <Services
                  classes={classes}
                  contacts={contacts}
                  messages={messages}
                  tasks={tasks}
                  toggleTask={toggleTask}
                />
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
