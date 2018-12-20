import React, { Component } from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { produce } from 'immer';

import { withStyles } from '@material-ui/core/styles';

import { GET_SERVICES } from '../stores/board';

// remote services
import { GET_ALL_CONTACTS, GET_ALL_REMOTE_CONTACTS } from '../stores/contacts';

import List from '../components/contacts/List';

import ContactForm from '../components/modal/ContactForm';
import { UPDATE_CONTACT, CREATE_CONTACT } from '../stores/organizations';
import ImportContactForm from '../components/modal/ImportContactForm';
import { ContentLoader } from '../components/Loader';

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

class Contacts extends Component {
  state = {
    openContactForm: false,
    openImportContactForm: false,
    selectedContact: undefined
  };

  handleEditContact = contact => {
    this.setState({ openContactForm: true, selectedContact: contact });
  };

  handleAddContact = () => {
    this.setState({ openContactForm: true, selectedContact: undefined });
  };

  handleImportContact = () => {
    this.setState({ openImportContactForm: true });
  };

  handleContactFormResult = async (result, serviceId) => {
    const { createContact, updateContact } = this.props;

    if (result) {
      const data = {
        name: result.name,
        email: result.email.length > 0 ? result.email : null,
        phone: result.phone.length > 0 ? result.phone : null
      };

      if (result.id) {
        await updateContact({
          id: result.id,
          data,
          ref: result.ref
        });
      } else {
        await createContact({
          data,
          ref: {
            serviceId
          }
        });
      }
    }

    this.setState({ openContactForm: false, selectedContact: undefined });
  };

  handleImportContactFormResult = async contact => {
    const { createContact } = this.props;

    if (contact) {
      await createContact({
        ref: {
          id: contact.id,
          serviceId: contact._serviceId
        }
      });
    }

    this.setState({ openImportContactForm: false });
  };

  render() {
    const { classes, contacts = [], remoteContacts = [], contactServices = [], contactsLoading = true } = this.props;
    const { openContactForm, openImportContactForm, selectedContact } = this.state;

    return (
      <div className={classes.root}>
        {contactsLoading ? (
          <ContentLoader loading={true} />
        ) : (
          <List
            contacts={contacts}
            onEditContact={this.handleEditContact}
            onAddContact={this.handleAddContact}
            onImportContact={this.handleImportContact}
          />
        )}
        {openContactForm && (
          <ContactForm
            contact={selectedContact}
            onClose={this.handleContactFormResult}
            contactServices={contactServices}
            disableImport
          />
        )}
        {openImportContactForm && (
          <ImportContactForm
            onClose={this.handleImportContactFormResult}
            contactServices={contactServices}
            remoteContacts={remoteContacts}
          />
        )}
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
      client.updateServices(services);
      const servicesEnabled = services.filter(s => s.enabled);
      return {
        services: servicesEnabled,
        contactServices: servicesEnabled.filter(s => s.type === 'contacts')
      };
    }
  }),
  graphql(GET_ALL_CONTACTS, {
    options: {
      // fetchPolicy: 'no-cache',
      context: {
        useNetworkStatusNotifier: false
      }
    },
    props({ data: { contacts = [], loading } }) {
      return { contacts, contactsLoading: loading };
    }
  }),
  graphql(GET_ALL_REMOTE_CONTACTS, {
    skip({ services = [] }) {
      return !services.find(s => s.type === 'contacts');
    },
    options: {
      // fetchPolicy: 'no-cache', // Same name query collision fix
      context: {
        serviceType: 'contacts',
        useNetworkStatusNotifier: false
      }
    },
    props({ data: { remoteContacts = [] }, ownProps: { contacts = [] } }) {
      if (contacts.length > 0) {
        remoteContacts = remoteContacts.filter(ro =>
          contacts.find(o => !(o.ref.id === ro.id && o.ref.serviceId === ro._serviceId))
        );
      }

      return {
        remoteContacts
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
              let { contacts = [] } = cache.readQuery({
                query: GET_ALL_CONTACTS,
                context: {
                  useNetworkStatusNotifier: false
                }
              });

              if (!contacts.find(c => c.id === contact.ref.id && c._serviceId === contact.ref.serviceId)) {
                contacts = [
                  ...contacts,
                  {
                    id: contact.ref.id,
                    _serviceId: contact.ref.serviceId,
                    _serviceType: 'contacts',
                    __typename: 'RemoteContact',
                    name: contact.name,
                    email: contact.email,
                    phone: contact.phone,
                    ref: contact.ref
                  }
                ];
                cache.writeQuery({
                  query: GET_ALL_CONTACTS,
                  context: {
                    useNetworkStatusNotifier: false
                  },
                  data: {
                    contacts
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
              let { contacts = [] } = cache.readQuery({
                query: GET_ALL_CONTACTS,
                context: {
                  useNetworkStatusNotifier: false
                }
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

                draft.contacts = updateContactList(draft.contacts);

                return draft;
              });

              const newData = mutate({ contacts });

              cache.writeQuery({
                query: GET_ALL_CONTACTS,
                context: {
                  useNetworkStatusNotifier: false
                },
                data: {
                  contacts: newData.contacts
                }
              });
            }
          });
        }
      };
    }
  }),
  withStyles(styles)
)(Contacts);
