import React, { Component, Fragment } from 'react';
import { compose, graphql, withApollo } from 'react-apollo';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import { UPDATE_CARD_ORDER, GET_SERVICES, getType, updateBoard } from '../stores/board';
import { GET_MESSAGES } from '../stores/messaging';
import { GET_TASKS, TOGGLE_TASK } from '../stores/tasks';
import {
  GET_CONTACTS,
  UPDATE_MULTIPLE_CONTACTS,
  UPDATE_OR_CREATE_CONTACTS,
  CREATE_STAGE,
  DELETE_STAGE,
  CREATE_COMPANY,
  optimisticUpdateMultipleContacts
} from '../stores/contacts';

import GridColumn from '../components/dnd/GridColumn';
import Column from '../components/dnd/Column';
import Card from '../components/dnd/Card';
import sort from '../components/dnd/sort';
import FormStage from '../components/modal/FormStage';
import ContactForm from '../components/modal/ContactForm';

const styles = () => ({
  addCardButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%'
  }
});

class Main extends Component {
  state = {
    openFormStage: false,
    openContactForm: false,
    stageId: null
  };

  handleOrder = result => {
    const { source, destination, draggableId } = result;
    const { updateMultipleContacts, columns = [] } = this.props;
    if (!destination) {
      return null;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return null;
    }

    if (destination.droppableId === source.droppableId) {
      //return updateCardOrder(source, destination, draggableId);
    } else {
      const ids = columns
        .find(c => c.id === source.droppableId)
        .cards.find(c => c.id === draggableId)
        .contacts.map(c => c.id);

      return updateMultipleContacts({ ids, stageId: destination.droppableId });
    }
  };

  handleOpenFormStage = () => {
    this.setState({ openFormStage: true });
  };

  handleFormStageResult = async result => {
    const { createStage } = this.props;
    if (result) {
      await createStage({ name: result });
    }
    this.setState({ openFormStage: false });
  };

  handleDeleteStage = id => {
    const { deleteStage } = this.props;
    deleteStage({ id });
  };

  handleCreateContact = id => {
    this.setState({ openContactForm: true, stageId: id });
  };

  handleContactFormResult = async result => {
    const { updateOrCreateContacts, createCompany } = this.props;

    if (!result) {
      this.setState({ openContactForm: false, stageId: null });
      return;
    }

    try {
      let { contacts, company } = result;

      if (company.__isNew__) {
        const {
          data: { company: newCompany }
        } = await createCompany({ name: company.label });
        contacts = contacts.map(c => {
          c.companyId = newCompany.id;
          return c;
        });
      }

      await updateOrCreateContacts({ contacts });
    } catch (err) {
      console.error(err);
    }

    this.setState({ openContactForm: false, stageId: null });
  };

  render() {
    const {
      columns = [],
      loading,
      messages = null,
      tasks = null,
      toggleTask,
      classes,
      companies = [],
      contacts = []
    } = this.props;
    const { openFormStage, openContactForm, stageId } = this.state;

    return (
      <Fragment>
        {loading ? (
          'loading'
        ) : (
          <GridColumn list={columns} onDragEnd={this.handleOrder}>
            {({ item: column }) => {
              return (
                <Column
                  id={column.id}
                  title={column.title}
                  list={column.cards}
                  onDelete={this.handleDeleteStage.bind(this, column.id)}
                  onAddCard={this.handleCreateContact.bind(this, column.id)}
                >
                  {({ item: card }) => {
                    const cardMessages = messages ? messages.filter(m => m.to === card.id) : null;
                    const cardTasks = tasks ? tasks.filter(m => m.to === card.id) : null;
                    return (
                      <Card
                        id={card.id}
                        title={card.title}
                        index={card.index}
                        contacts={card.contacts}
                        messages={cardMessages}
                        tasks={cardTasks}
                        toggleTask={toggleTask}
                      />
                    );
                  }}
                </Column>
              );
            }}
          </GridColumn>
        )}
        <Button
          variant="fab"
          color="primary"
          aria-label="Add"
          className={classes.addCardButton}
          onClick={this.handleOpenFormStage}
        >
          <AddIcon />
        </Button>
        <FormStage open={openFormStage} onClose={this.handleFormStageResult} />
        <ContactForm
          open={openContactForm}
          stageId={stageId}
          onClose={this.handleContactFormResult}
          companies={companies}
          contacts={contacts}
        />
      </Fragment>
    );
  }
}

export default compose(
  withApollo,
  graphql(GET_SERVICES, {
    props({ data: { services = [] }, ownProps: { client } }) {
      // return for now only the enabled services
      services = services.map(s => ({ ...s, type: getType(s) }));

      client.updateServices(services);
      return { services: services.filter(s => s.enabled) };
    }
  }),
  graphql(GET_CONTACTS, {
    skip({ services = [] }) {
      return !services.find(s => s.type === 'orgs');
    },
    options: {
      context: {
        serviceType: 'orgs'
      },
      fetchPolicy: 'cache-and-network'
    },
    props({ data: { contacts = [], stages = [], companies = [], loading } }) {
      return {
        columns: updateBoard({
          groups: stages,
          items: contacts
        }),
        contacts,
        stages,
        companies,
        loading
      };
    }
  }),
  graphql(UPDATE_MULTIPLE_CONTACTS, {
    props({ mutate, ownProps: { contacts, stages } }) {
      return {
        updateMultipleContacts: variables => {
          return mutate({
            variables,
            context: {
              serviceType: 'orgs'
            },
            optimisticResponse: {
              contacts: optimisticUpdateMultipleContacts({ contacts, stages }, variables)
            }
          });
        }
      };
    }
  }),
  graphql(UPDATE_OR_CREATE_CONTACTS, {
    props({ mutate }) {
      return {
        updateOrCreateContacts: variables => {
          return mutate({
            variables,
            context: {
              serviceType: 'orgs'
            },
            update(
              cache,
              {
                data: { contacts }
              }
            ) {
              const { contacts: oldContacts, ...data } = cache.readQuery({ query: GET_CONTACTS });

              const newContacts = [];
              contacts.forEach(c => {
                if (!oldContacts.find(oc => oc.id === c.id)) {
                  newContacts.push(c);
                }
              });

              cache.writeQuery({
                query: GET_CONTACTS,
                data: { ...data, contacts: oldContacts.concat(newContacts) }
              });
            }
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
            context: {
              serviceType: 'orgs'
            },
            update(
              cache,
              {
                data: { stage }
              }
            ) {
              const { stages, ...data } = cache.readQuery({ query: GET_CONTACTS });
              cache.writeQuery({
                query: GET_CONTACTS,
                data: { ...data, stages: stages.concat([stage]) }
              });
            }
          });
        }
      };
    }
  }),
  graphql(DELETE_STAGE, {
    options: {
      refetchQueries: [
        {
          query: GET_CONTACTS,
          context: {
            serviceType: 'orgs'
          }
        }
      ]
    },
    props({ mutate }) {
      return {
        deleteStage: variables => {
          return mutate({
            variables,
            context: {
              serviceType: 'orgs'
            }
          });
        }
      };
    }
  }),
  graphql(CREATE_COMPANY, {
    props({ mutate }) {
      return {
        createCompany: variables => {
          return mutate({
            variables,
            context: {
              serviceType: 'orgs'
            },
            update(
              cache,
              {
                data: { company }
              }
            ) {
              const { companies, ...data } = cache.readQuery({ query: GET_CONTACTS });
              cache.writeQuery({
                query: GET_CONTACTS,
                data: { ...data, companies: companies.concat([company]) }
              });
            }
          });
        }
      };
    }
  }),
  graphql(UPDATE_CARD_ORDER, {
    props({ mutate, ownProps: { columns } }) {
      return {
        updateCardOrder: (source, destination, cardId) => {
          return mutate({
            variables: {
              source,
              destination,
              cardId
            },
            optimisticResponse: {
              columns: sort(columns, source, destination, cardId)
            }
          });
        }
      };
    }
  }),
  graphql(GET_MESSAGES, {
    skip({ services = [] }) {
      return !services.find(s => s.type === 'messaging');
    },
    options: {
      context: {
        serviceType: 'messaging'
      },
      fetchPolicy: 'cache-and-network'
    },
    props({ data: { messages = [] } }) {
      return {
        messages
      };
    }
  }),
  graphql(GET_TASKS, {
    skip({ services = [] }) {
      return !services.find(s => s.type === 'tasks');
    },
    options: {
      context: {
        serviceType: 'tasks'
      },
      fetchPolicy: 'cache-and-network'
    },
    props({ data: { tasks = [] } }) {
      return {
        tasks
      };
    }
  }),
  graphql(TOGGLE_TASK, {
    props({ mutate }) {
      return {
        toggleTask: ({ id, serviceId }) => {
          return mutate({
            variables: {
              id
            },
            context: {
              serviceType: 'tasks',
              serviceId
            }
          });
        }
      };
    }
  }),
  withStyles(styles)
)(Main);
