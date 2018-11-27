import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import { GET_SERVICES, SWITCH_SERVICE } from '../stores/board';
import ServiceCard from '../components/ServiceCard';

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3
  },
  container: {
    margin: theme.spacing.unit
  }
});

class Services extends Component {
  render() {
    const { services, switchService, classes } = this.props;
    const enabledServices = services.filter(s => s.enabled);
    const availableServices = services.filter(s => !s.enabled);

    return services.length ? (
      <div className={classes.root}>
        <Typography variant="h5" gutterBottom>
          Enabled Services
        </Typography>
        <Grid container spacing={24} className={classes.container}>
          {enabledServices.map(service => (
            <Grid item xs={3} key={service.id}>
              <ServiceCard service={service} switchService={switchService} />
            </Grid>
          ))}
          {!enabledServices.length && (
            <Typography variant="body1" color="textSecondary">
              No services enabled.
            </Typography>
          )}
        </Grid>
        <Typography variant="h5" gutterBottom>
          Available Services
        </Typography>
        <Grid container spacing={24} className={classes.container}>
          {availableServices.map(service => (
            <Grid item xs={3} key={service.id}>
              <ServiceCard service={service} switchService={switchService} />
            </Grid>
          ))}
        </Grid>
      </div>
    ) : null;
  }
}

export default compose(
  graphql(GET_SERVICES, {
    options: { pollInterval: 7500 },
    props({ data: { services = [] } }) {
      return {
        services
      };
    }
  }),
  graphql(SWITCH_SERVICE, {
    props({ mutate }) {
      return {
        switchService: id => {
          return mutate({
            variables: {
              id
            }
          });
        }
      };
    }
  }),
  withStyles(styles)
)(Services);
