import React, { Component, Fragment } from 'react';
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
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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

const Services = ({ classes }) => (
  <Fragment>
    <ExpansionPanel className={classes.expansionPanel}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>Tasks</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo
          lobortis eget.
        </Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
    <ExpansionPanel className={classes.expansionPanel}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>Messages</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo
          lobortis eget.
        </Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  </Fragment>
);

class Card extends Component {
  render() {
    const { classes, id, title, index, subheader } = this.props;

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
                titleTypographyProps={{ variant: 'body2' }}
              />
              <CardContent className={classes.cardContent}>
                <Services classes={classes} />
              </CardContent>
            </MuiCard>
          </RootRef>
        )}
      </Draggable>
    );
  }
}

export default withStyles(styles)(Card);
