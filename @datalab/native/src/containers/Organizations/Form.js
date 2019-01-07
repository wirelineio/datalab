import React, { Component } from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { Spinner } from 'native-base';

import Form from '../../components/organizations/Form';
import { Screen, Col } from '../../components/Layout';
import { GET_ALL_STAGES, CREATE_ORGANIZATION } from '../../stores/organizations';
import { GET_SERVICES } from '../../stores/services';

class OrganizationsForm extends Component {
  handleOrganizationFormResult = async (result, serviceId) => {
    const { createOrganization, updateOrganization, navigation } = this.props;

    if (result) {
      console.log('handleOrganizationFormResult', result);

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

    navigation.navigate('OrganizationsList');
  };

  handleSpellcheck = () => {
    console.log('handleSpellcheck');
  };

  render() {
    const { navigation, stages = [], loadingStages = true, contactServices = [] } = this.props;

    const organization = navigation.getParam('organization') || {};

    return (
      <Screen>
        {loadingStages && <Spinner />}
        {!loadingStages && (
          <Form
            organization={organization}
            stages={[{ id: '', name: 'Uncategorized' }, ...stages]}
            onResult={this.handleOrganizationFormResult}
            onSpellcheck={this.handleSpellcheck}
            services={contactServices}
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
    props({ data: { services = [] }, ownProps: { client } }) {
      client.updateServices(services);
      const servicesEnabled = services.filter(s => s.enabled);
      return {
        services: servicesEnabled,
        contactServices: servicesEnabled.filter(s => s.type === 'contacts')
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
  graphql(CREATE_ORGANIZATION, {
    props({ mutate }) {
      return {
        createOrganization: variables => {
          return mutate({
            variables
          });
        }
      };
    }
  })
)(OrganizationsForm);
