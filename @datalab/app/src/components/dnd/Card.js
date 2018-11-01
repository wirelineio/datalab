import React, { Fragment } from 'react';
import { Draggable } from 'react-beautiful-dnd';

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
import Grid from '@material-ui/core/Grid';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Messaging from '../service-types/Messaging';
import Tasks from '../service-types/Tasks';
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

const Card = ({ classes, id, title, contacts, index, subheader, messages, tasks, toggleTask }) => {
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
              action={
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              }
              title={title}
              subheader={subheader}
              className={classes.header}
              titleTypographyProps={{ variant: 'subtitle2' }}
            />
            <Divider />
            <CardContent>
              <Orgs contacts={contacts} />
            </CardContent>
            <CardContent className={classes.cardContent}>
              <Services
                classes={classes}
                contacts={contacts}
                messages={messages}
                tasks={tasks}
                toggleTask={toggleTask}
              />
            </CardContent>
          </MuiCard>
        </RootRef>
      )}
    </Draggable>
  );
};

export default withStyles(styles)(Card);
