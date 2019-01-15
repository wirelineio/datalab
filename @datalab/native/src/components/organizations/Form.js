import { Formik, Field } from 'formik';
import React, { Component, Fragment } from 'react';
import { Keyboard } from 'react-native';
import { Form } from 'native-base';
import * as Yup from 'yup';
import styled from 'styled-components/native';
import Button from '../Button';
import { TextField, PickerField, TextareaField } from '../form';
import Modal from '../Modal';

const initialValues = organization => ({
  id: organization.id || null,
  name: organization.name || '',
  stage: organization.stage ? organization.stage.id : '',
  url: organization.url || '',
  goals: organization.goals || ''
});

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters long.')
    .required('Name is required.'),
  url: Yup.string()
    .url('The Website must be a valid url.')
    .required('URL is required.'),
  goals: Yup.string(),
  stage: Yup.string()
});

const ServiceButton = styled(Button)`
  margin-bottom: 8px;
  display: flex;
`;

class SubmitButton extends Component {
  state = {
    showServices: false,
    selectedService: null
  };

  submit = () => {
    if (this.props.services.length === 1) {
      return this.selectService(this.props.services[0].id);
    }

    this.showServicesModal();
  };

  showServicesModal = () => {
    this.setState({ showServices: true });
  };

  closeServicesModal = () => {
    this.setState({ showServices: false });
  };

  selectService = serviceId => {
    this.props.onServiceSelected(serviceId);
    this.closeServicesModal();
  };

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.services && nextProps.services.length === 1) {
      return {
        showServices: false,
        selectedService: nextProps.services[0]
      };
    }

    return null;
  }

  render() {
    const { services = [], isSubmitting } = this.props;
    const { showServices, selectedService } = this.state;
    const noServices = services.length === 0;

    return (
      <Fragment>
        <Button block onPress={this.submit} disabled={isSubmitting || noServices} margin={8}>
          {noServices
            ? 'No available services'
            : isSubmitting
            ? 'Saving...'
            : `Save in ${selectedService ? selectedService.name : '...'}`}
        </Button>
        {showServices && (
          <Modal onClose={this.closeServicesModal} title="Pick a service to save the organization">
            {services.map((s, i) => (
              <ServiceButton key={i} block onPress={() => this.selectService(s.id)}>
                {s.name}
              </ServiceButton>
            ))}
          </Modal>
        )}
      </Fragment>
    );
  }
}

class OrganizationsForm extends Component {
  state = {
    serviceId: null
  };

  onSubmit = async (values, actions) => {
    Keyboard.dismiss();
    actions.setSubmitting(true);
    await this.props.onResult(values, this.state.serviceId);
  };

  onServiceSelected = serviceId => {
    this.setState({ serviceId });
  };

  render() {
    const { organization = {}, stages = [], services = [], onSpellCheck } = this.props;

    return (
      <Formik initialValues={initialValues(organization)} validationSchema={validationSchema} onSubmit={this.onSubmit}>
        {({ handleSubmit, isSubmitting }) => {
          return (
            <Form>
              <Field name="name" label="Name" component={TextField} />
              <Field name="url" label="URL" component={TextField} />
              <Field name="goals" label="Goals" component={TextareaField} onSpellCheck={onSpellCheck} />
              <Field
                name="stage"
                label="Stage"
                component={PickerField}
                options={stages}
                labelField="name"
                valueField="id"
              />
              <SubmitButton
                isSubmitting={isSubmitting}
                services={services}
                onServiceSelected={serviceId => {
                  this.onServiceSelected(serviceId);
                  handleSubmit();
                }}
              />
            </Form>
          );
        }}
      </Formik>
    );
  }
}

export default OrganizationsForm;
