import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { ButtonLoader } from './Loader';

const styles = theme => ({
  card: {
    maxWidth: 500
  },
  actions: {
    display: 'flex'
  },
  edit: {
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8
    }
  },
  expandClose: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  avatar: {
    backgroundColor: red[500]
  },
  button: {
    margin: theme.spacing.unit
  }
});

const TYPES = {
  messaging: 'Messaging',
  tasks: 'Tasks',
  contacts: 'Contacts/Orgs'
};

class ServiceCard extends React.Component {
  state = {
    expanded: false,
    switching: false
  };

  handleSwitchService = async () => {
    const { service, switchService } = this.props;
    this.setState({ switching: true });
    try {
      await switchService(service.id);
    } catch (err) {
      console.log(err);
    }
    this.setState({ switching: false });
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const { classes, service } = this.props;
    const { switching } = this.state;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="Service" className={classes.avatar}>
              {service.type[0].toUpperCase()}
            </Avatar>
          }
          title={service.name}
          subheader={TYPES[service.type]}
        />
        <CardContent>
          <Typography component="p">{service.description}</Typography>
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          <Grid container>
            <ButtonLoader loading={switching}>
              <Button
                className={classes.button}
                onClick={this.handleSwitchService}
                variant="outlined"
                aria-label={service.enabled ? 'Disable' : 'Enable'}
              >
                {service.enabled ? 'Disable' : 'Enable'}
              </Button>
            </ButtonLoader>
          </Grid>
          <Grid container justify="flex-end">
            {service.enabled && (
              <ButtonLoader loading={switching}>
                <Button
                  className={classes.button}
                  variant="outlined"
                  onClick={this.handleExpandClick}
                  aria-label="Edit"
                >
                  Config{' '}
                  <ExpandMoreIcon
                    className={classnames(classes.expandClose, {
                      [classes.expandOpen]: this.state.expanded
                    })}
                  />
                </Button>
              </ButtonLoader>
            )}
          </Grid>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Grid container spacing={24}>
              <Grid item xs={12} md={6}>
                <TextField required id="user" label="User" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField required id="token" label="token" fullWidth />
              </Grid>
            </Grid>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

export default withStyles(styles)(ServiceCard);
