import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { GET_SERVICES, SWITCH_SERVICE } from '../stores/board';
import ServiceCard from '../components/ServiceCard';

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3
  }
});

class Services extends Component {
  render() {
    const { services, switchService, classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          {services.map(service => (
            <Grid item xs={3} key={service.id}>
              <ServiceCard service={service} switchService={switchService} />
            </Grid>
          ))}
        </Grid>
      </div>
    );
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
