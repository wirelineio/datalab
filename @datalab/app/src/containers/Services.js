import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';

import Grid from '@material-ui/core/Grid';

import { GET_SERVICES, SWITCH_SERVICE, getType } from '../stores/board';
import ServiceCard from '../components/ServiceCard';

class Services extends Component {
  render() {
    const { services, switchService } = this.props;

    return (
      <Grid container spacing={24}>
        {services.map(service => (
          <Grid item xs={3} key={service.id}>
            <ServiceCard service={service} switchService={switchService} />
          </Grid>
        ))}
      </Grid>
    );
  }
}

export default compose(
  graphql(GET_SERVICES, {
    props({ data: { services = [] } }) {
      return {
        services: services.map(s => ({
          ...s,
          type: getType(s)
        }))
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
  })
)(Services);
