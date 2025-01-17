import React, { Component } from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { Spinner, Toast } from 'native-base';

import Form from '../components/organizations/Form';
import { Screen } from '../components/Layout';
import {
  GET_ALL_STAGES,
  CREATE_ORGANIZATION,
  GET_ALL_ORGANIZATIONS,
  UPDATE_ORGANIZATION,
  updateOrganizationOptimistic
} from '../stores/organizations';
import { GET_SERVICES } from '../stores/services';
import { SPELLCHECK } from '../stores/spellcheck';

class OrganizationsForm extends Component {
  handleOrganizationFormResult = async (result, serviceId) => {
    const { createOrganization, updateOrganization, navigation } = this.props;

    if (result) {
      const data = {
        name: result.name,
        url: result.url.length > 0 ? result.url : null,
        goals: result.goals.length > 0 ? result.goals : null
      };

      const stageId = result.stage || null;

      if (result.id) {
        await updateOrganization({ id: result.id, data, stageId });
      } else {
        await createOrganization({ ref: { serviceId }, data, stageId });
      }
    }

    Toast.show({
      text: `Organization ${result.id ? 'updated' : 'created'}!`,
      buttonText: 'OK',
      type: 'success',
      duration: 3000
    });

    navigation.navigate('OrganizationsList');
  };

  handleSpellCheck = async value => {
    const { client } = this.props;

    const {
      data: { errors = [] }
    } = await client.query({
      query: SPELLCHECK,
      context: {
        serviceType: 'spellcheck',
        useNetworkStatusNotifier: false
      },
      variables: { value },
      fetchPolicy: 'network-only'
    });

    return errors;
  };

  render() {
    const {
      navigation,
      stages = [],
      loadingStages = true,
      contactServices = [],
      services = [],
      loadingServices = true
    } = this.props;
    const organization = navigation.getParam('organization') || {};

    const filteredContactservices = organization.id
      ? contactServices.filter(cs => cs.id === organization.ref.serviceId)
      : contactServices;

    const spellCheckServiceReady = !loadingServices && services.find(s => s.type === 'spellcheck');

    return (
      <Screen>
        {loadingStages && <Spinner />}
        {!loadingStages && (
          <Form
            organization={organization}
            stages={[{ id: '', name: 'Uncategorized' }, ...stages]}
            onResult={this.handleOrganizationFormResult}
            onSpellCheck={spellCheckServiceReady && this.handleSpellCheck}
            services={filteredContactservices}
          />
        )}
      </Screen>
    );
  }
}

export default compose(
  withApollo,
  graphql(GET_SERVICES, {
    options: {
      context: {
        useNetworkStatusNotifier: false
      }
    },
    props({ data: { services = [], loading }, ownProps: { client } }) {
      client.updateServices(services);
      const servicesEnabled = services.filter(s => s.enabled);
      return {
        services: servicesEnabled,
        contactServices: servicesEnabled.filter(s => s.type === 'contacts'),
        loadingServices: loading
      };
    }
  }),
  graphql(GET_ALL_STAGES, {
    props({ data: { stages = [], loading } }) {
      return {
        stages,
        loadingStages: loading
      };
    }
  }),
  graphql(GET_ALL_ORGANIZATIONS, {
    options: {
      pollInterval: 30000
    },
    props({ data: { organizations = [] } }) {
      return {
        organizations
      };
    }
  }),
  graphql(CREATE_ORGANIZATION, {
    props({ mutate }) {
      return {
        createOrganization: variables => {
          return mutate({
            variables,
            update(
              cache,
              {
                data: { organization }
              }
            ) {
              const { organizations, ...data } = cache.readQuery({ query: GET_ALL_ORGANIZATIONS });
              cache.writeQuery({
                query: GET_ALL_ORGANIZATIONS,
                data: { ...data, organizations: organizations.concat([organization]) }
              });
            }
          });
        }
      };
    }
  }),
  graphql(UPDATE_ORGANIZATION, {
    props({ mutate, ownProps: { organizations, stages } }) {
      return {
        updateOrganization: (variables, optimistic = true) => {
          return mutate({
            variables,
            context: {
              useNetworkStatusNotifier: false
            },
            optimisticResponse: optimistic ? updateOrganizationOptimistic({ organizations, stages }, variables) : null
          });
        }
      };
    }
  })
)(OrganizationsForm);
