import React, { Component } from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { produce } from 'immer';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';

import GraphIcon from '@material-ui/icons/BubbleChart';
import KanbanIcon from '@material-ui/icons/InsertChart';
import ListIcon from '@material-ui/icons/GridOn';

import { GET_SERVICES } from '../stores/board';
import {
  GET_ALL_ORGANIZATIONS,
  CREATE_CONTACT,
  UPDATE_CONTACT,
  CREATE_ORGANIZATION,
  UPDATE_ORGANIZATION,
  DELETE_ORGANIZATION,
  ADD_CONTACT_TO_ORGANIZATION,
  MOVE_CONTACT_TO_ORGANIZATION,
  DELETE_CONTACT_FROM_ORGANIZATION,
  CREATE_STAGE,
  UPDATE_STAGE,
  DELETE_STAGE,
  updateOrganizationOptimistic,
  updateContactToOrganizationOtimistic,
  deleteContactFromOrganizationOtimistic
} from '../stores/organizations';

// remote services
import { GET_ALL_REMOTE_CONTACTS, GET_ALL_REMOTE_ORGANIZATIONS } from '../stores/contacts';
import { SPELLCHECK } from '../stores/spellcheck';

import StageForm from '../components/modal/StageForm';
import OrganizationForm from '../components/modal/OrganizationForm';
import ContactForm from '../components/modal/ContactForm';
import ImportOrganizationForm from '../components/modal/ImportOrganizationForm';

import Graph from '../components/organizations/Graph';
import Kanban from '../components/organizations/Kanban';
import List from '../components/organizations/List';

const styles = theme => ({
  root: {},
  viewIcon: {
    paddingRight: theme.spacing.unit
  },
  viewRenderValue: {
    display: 'flex',
    alignItems: 'center'
  }
});

class Organizations extends Component {
  state = {
    selectedView: 0,
    openStageForm: false,
    openOrganizationForm: false,
    openContactForm: false,
    openImportOrganizationForm: false,
    selectedStage: undefined,
    selectedOrganization: undefined,
    selectedContact: undefined
  };

  views = [
    {
      title: 'Kanban',
      Component: Kanban,
      Icon: KanbanIcon
    },
    {
      title: 'List',
      Component: List,
      Icon: ListIcon
    },
    {
      title: 'Graph',
      Component: Graph,
      Icon: GraphIcon
    }
  ];

  handleSelectViewChange = event => {
    this.setState({ selectedView: event.target.value });
  };

  handleAddStage = () => {
    this.setState({ openStageForm: true });
  };

  handleEditStage = stage => {
    this.setState({ openStageForm: true, selectedStage: stage });
  };

  handleStageFormResult = async result => {
    const { createStage, updateStage } = this.props;

    if (result) {
      if (result.id) {
        await updateStage({ id: result.id, name: result.name });
      } else {
        await createStage({ name: result.name });
      }
    }

    this.setState({ openStageForm: false, selectedStage: undefined });
  };

  handleDeleteStage = ({ id }) => {
    const { deleteStage } = this.props;
    deleteStage({ id });
  };

  handleAddOrganization = stage => {
    this.setState({ openOrganizationForm: true, selectedStage: stage });
  };

  handleEditOrganization = organization => {
    this.setState({ openOrganizationForm: true, selectedOrganization: organization });
  };

  handleImportOrganization = stage => {
    this.setState({ openImportOrganizationForm: true, selectedStage: stage });
  };

  handleImportOrganizationFormResult = async result => {
    const { createOrganization } = this.props;
    const { selectedStage } = this.state;

    if (result) {
      await createOrganization({
        ref: {
          id: result.ref.value,
          serviceId: result.ref.serviceId
        },
        stageId: selectedStage ? selectedStage.id : null
      });
    }

    this.setState({ openImportOrganizationForm: false, selectedStage: undefined });
  };

  handleOrganizationFormResult = async (result, serviceId) => {
    const { createOrganization, updateOrganization } = this.props;

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

    this.setState({ openOrganizationForm: false, selectedStage: undefined, selectedOrganization: undefined });
  };

  handleDeleteOrganization = ({ id }) => {
    const { deleteOrganization } = this.props;
    deleteOrganization({ id });
  };

  handleAddContact = organization => {
    this.setState({ openContactForm: true, selectedOrganization: organization });
  };

  handleEditContact = contact => {
    this.setState({ openContactForm: true, selectedContact: contact });
  };

  handleDeleteContact = (contact, organizationId) => {
    const { deleteContactFromOrganization } = this.props;
    return deleteContactFromOrganization({ id: organizationId, contactId: contact.id });
  };

  handleContactFormResult = async (result, serviceId) => {
    const { createContact, updateContact, addContactToOrganization } = this.props;

    if (result) {
      const { remoteContact = { _serviceId: serviceId } } = result.ref || {};

      const data = {
        name: result.name,
        email: result.email.length > 0 ? result.email : null,
        phone: result.phone.length > 0 ? result.phone : null
      };

      if (result.id) {
        await updateContact({ id: result.id, data });
      } else {
        const {
          data: { contact }
        } = await createContact({
          data,
          ref: {
            id: remoteContact.id,
            serviceId: remoteContact._serviceId
          }
        });

        await addContactToOrganization({ id: result.organizationId, contactId: contact.id });
      }
    }

    this.setState({ openContactForm: false, selectedOrganization: undefined, selectedContact: undefined });
  };

  handleSpellcheck = async variables => {
    const { client } = this.props;
    const {
      data: { errors = [] }
    } = await client.query({
      query: SPELLCHECK,
      context: {
        serviceType: 'spellcheck',
        useNetworkStatusNotifier: false
      },
      variables,
      fetchPolicy: 'network-only'
    });

    return errors.reduce((prev, curr) => {
      const defaultMessage = word => `${word} is misspelled.`;
      if (!curr.messages) curr.messages = [defaultMessage(curr.word)];

      let error = prev.find(e => e.word === curr.word);

      if (error) {
        error.items.push(curr);
      } else {
        prev.push({
          word: curr.word,
          items: [curr]
        });
      }
      return prev;
    }, []);
  };

  render() {
    const {
      classes,
      organizations = [],
      stages = [],
      remoteContacts = [],
      updateOrganization,
      moveContactToOrganization,
      contactServices,
      remoteOrganizations = []
    } = this.props;
    const {
      selectedView,
      openStageForm,
      selectedStage,
      openOrganizationForm,
      selectedOrganization,
      openContactForm,
      selectedContact,
      openImportOrganizationForm
    } = this.state;
    const selectedViewCfg = this.views[selectedView];
    const SelectedView = selectedViewCfg.Component;
    const SelectedViewIcon = selectedViewCfg.Icon;

    return (
      <div className={classes.root}>
        <Toolbar>
          <Select
            value={selectedView}
            onChange={this.handleSelectViewChange}
            renderValue={() => (
              <div className={classes.viewRenderValue}>
                <SelectedViewIcon className={classes.viewIcon} />
                <div>{selectedViewCfg.title}</div>
              </div>
            )}
          >
            {this.views.map(({ title, Icon }, index) => (
              <MenuItem key={title} value={index}>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText>{title}</ListItemText>
              </MenuItem>
            ))}
          </Select>
        </Toolbar>
        <SelectedView
          organizations={organizations}
          stages={stages}
          onImportOrganization={this.handleImportOrganization}
          onAddOrganization={this.handleAddOrganization}
          onEditOrganization={this.handleEditOrganization}
          onDeleteOrganization={this.handleDeleteOrganization}
          onAddContact={this.handleAddContact}
          onEditContact={this.handleEditContact}
          onDeleteContact={this.handleDeleteContact}
          onAddStage={this.handleAddStage}
          onEditStage={this.handleEditStage}
          onDeleteStage={this.handleDeleteStage}
          // TODO(elmasse): Review these used in Kanban view.
          moveContactToOrganization={moveContactToOrganization}
          updateOrganization={updateOrganization}
        />
        <StageForm open={openStageForm} stage={selectedStage} onClose={this.handleStageFormResult} />
        {openOrganizationForm && (
          <OrganizationForm
            open={openOrganizationForm}
            organization={selectedOrganization}
            stage={selectedStage}
            stages={[{ id: '', name: 'Uncategorized' }, ...stages]}
            onClose={this.handleOrganizationFormResult}
            onSpellcheck={this.handleSpellcheck}
            services={contactServices}
          />
        )}
        {openContactForm && (
          <ContactForm
            organization={selectedOrganization}
            contact={selectedContact}
            remoteContacts={remoteContacts}
            onClose={this.handleContactFormResult}
            contactServices={contactServices}
          />
        )}
        <ImportOrganizationForm
          open={openImportOrganizationForm}
          remoteOrganizations={remoteOrganizations}
          onClose={this.handleImportOrganizationFormResult}
        />
      </div>
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
      // return for now only the enabled services
      client.updateServices(services);
      const servicesEnabled = services.filter(s => s.enabled);
      return {
        services: servicesEnabled,
        contactServices: servicesEnabled.filter(s => s.type === 'contacts')
      };
    }
  }),
  graphql(GET_ALL_ORGANIZATIONS, {
    props({ data: { organizations = [], stages = [], loading } }) {
      return {
        organizations,
        stages,
        loading
      };
    }
  }),
  graphql(GET_ALL_REMOTE_CONTACTS, {
    skip({ services = [] }) {
      return !services.find(s => s.type === 'contacts');
    },
    options: {
      context: {
        serviceType: 'contacts',
        useNetworkStatusNotifier: false
      }
    },
    props({ data: { remoteContacts = [] } }) {
      return { remoteContacts };
    }
  }),
  graphql(GET_ALL_REMOTE_ORGANIZATIONS, {
    skip({ services = [] }) {
      return !services.find(s => s.type === 'contacts');
    },
    options: {
      context: {
        serviceType: 'contacts',
        useNetworkStatusNotifier: false
      }
    },
    props({ data: { remoteOrganizations = [] } }) {
      return { remoteOrganizations };
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
              useNetworkStatusNotifier: !optimistic
            },
            optimisticResponse: optimistic ? updateOrganizationOptimistic({ organizations, stages }, variables) : null
          });
        }
      };
    }
  }),
  graphql(CREATE_CONTACT, {
    props({ mutate }) {
      return {
        createContact: variables => {
          return mutate({
            variables,
            update(
              cache,
              {
                data: { contact }
              }
            ) {
              let { remoteContacts = [] } = cache.readQuery({
                query: GET_ALL_REMOTE_CONTACTS,
                context: {
                  serviceType: 'contacts',
                  useNetworkStatusNotifier: false
                }
              });
              if (!remoteContacts.find(c => c.id === contact.ref.id && c._serviceId === contact.ref.serviceId)) {
                remoteContacts = [
                  ...remoteContacts,
                  {
                    id: contact.ref.id,
                    _serviceId: contact.ref.serviceId,
                    _serviceType: 'contacts',
                    __typename: 'RemoteContact',
                    name: contact.name,
                    email: contact.email,
                    phone: contact.phone
                  }
                ];
                cache.writeQuery({
                  query: GET_ALL_REMOTE_CONTACTS,
                  context: {
                    serviceType: 'contacts',
                    useNetworkStatusNotifier: false
                  },
                  data: {
                    remoteContacts
                  }
                });
              }
            }
          });
        }
      };
    }
  }),
  graphql(UPDATE_CONTACT, {
    props({ mutate }) {
      return {
        updateContact: variables => {
          return mutate({
            variables,
            update(
              cache,
              {
                data: { contact }
              }
            ) {
              let { remoteContacts = [] } = cache.readQuery({
                query: GET_ALL_REMOTE_CONTACTS,
                context: {
                  serviceType: 'contacts',
                  useNetworkStatusNotifier: false
                }
              });

              let { organizations = [], ...dataOrgs } = cache.readQuery({
                query: GET_ALL_ORGANIZATIONS
              });

              const mutate = produce(draft => {
                const updateContactList = list => {
                  const idx = list.findIndex(c => c.id === contact.ref.id && c._serviceId === contact.ref.serviceId);
                  if (idx === -1) {
                    return list;
                  }
                  list[idx] = Object.assign({}, list[idx], {
                    name: contact.name,
                    email: contact.email,
                    phone: contact.phone
                  });
                  return list;
                };

                draft.remoteContacts = updateContactList(draft.remoteContacts);

                for (const organization of draft.organizations) {
                  organization.contacts = updateContactList(organization.contacts);
                }

                return draft;
              });

              const newData = mutate({ remoteContacts, organizations });

              cache.writeQuery({
                query: GET_ALL_REMOTE_CONTACTS,
                context: {
                  serviceType: 'contacts',
                  useNetworkStatusNotifier: false
                },
                data: {
                  remoteContacts: newData.remoteContacts
                }
              });

              cache.writeQuery({
                query: GET_ALL_ORGANIZATIONS,
                data: { organizations: newData.organizations, ...dataOrgs }
              });
            }
          });
        }
      };
    }
  }),
  graphql(DELETE_ORGANIZATION, {
    options: {
      refetchQueries: [
        {
          query: GET_ALL_ORGANIZATIONS
        }
      ]
    },
    props({ mutate }) {
      return {
        deleteOrganization: variables => {
          return mutate({
            variables
          });
        }
      };
    }
  }),
  graphql(ADD_CONTACT_TO_ORGANIZATION, {
    props({ mutate }) {
      return {
        addContactToOrganization: variables => {
          return mutate({
            variables
          });
        }
      };
    }
  }),
  graphql(MOVE_CONTACT_TO_ORGANIZATION, {
    props({ mutate, ownProps: { organizations } }) {
      return {
        moveContactToOrganization: variables => {
          return mutate({
            variables,
            context: {
              useNetworkStatusNotifier: false
            },
            optimisticResponse: updateContactToOrganizationOtimistic({ organizations }, variables)
          });
        }
      };
    }
  }),
  graphql(DELETE_CONTACT_FROM_ORGANIZATION, {
    props({ mutate, ownProps: { organizations } }) {
      return {
        deleteContactFromOrganization: variables => {
          return mutate({
            variables,
            context: {
              useNetworkStatusNotifier: false
            },
            optimisticResponse: deleteContactFromOrganizationOtimistic({ organizations }, variables)
          });
        }
      };
    }
  }),
  graphql(CREATE_STAGE, {
    props({ mutate }) {
      return {
        createStage: variables => {
          return mutate({
            variables,
            update(
              cache,
              {
                data: { stage }
              }
            ) {
              const { stages, ...data } = cache.readQuery({ query: GET_ALL_ORGANIZATIONS });
              cache.writeQuery({
                query: GET_ALL_ORGANIZATIONS,
                data: { ...data, stages: stages.concat([stage]) }
              });
            }
          });
        }
      };
    }
  }),
  graphql(UPDATE_STAGE, {
    props({ mutate }) {
      return {
        updateStage: variables => {
          return mutate({
            variables
          });
        }
      };
    }
  }),
  graphql(DELETE_STAGE, {
    options: {
      refetchQueries: [
        {
          query: GET_ALL_ORGANIZATIONS
        }
      ]
    },
    props({ mutate }) {
      return {
        deleteStage: variables => {
          return mutate({
            variables
          });
        }
      };
    }
  }),
  withStyles(styles)
)(Organizations);
