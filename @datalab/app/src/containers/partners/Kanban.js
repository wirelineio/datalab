import React, { Component, Fragment } from 'react';
import { compose, graphql, withApollo } from 'react-apollo';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import { GET_SERVICES, getType } from '../../stores/board';
import {
  GET_ALL_PARTNERS,
  CREATE_CONTACT,
  UPDATE_CONTACT,
  CREATE_PARTNER,
  UPDATE_PARTNER,
  DELETE_PARTNER,
  ADD_CONTACT_TO_PARTNER,
  MOVE_CONTACT_TO_PARTNER,
  CREATE_STAGE,
  UPDATE_STAGE,
  DELETE_STAGE,
  updatePartnerOptimistic,
  updateContactToPartnerOtimistic,
  updateKanban
} from '../../stores/orgs';

import GridColumn from '../../components/dnd/GridColumn';
import Column from '../../components/dnd/Column';
import Card from '../../components/dnd/Card';
import StageForm from '../../components/modal/StageForm';
import PartnerForm from '../../components/modal/PartnerForm';
import ContactForm from '../../components/modal/ContactForm';

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3
  },
  addCardButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%'
  }
});

class Kanban extends Component {
  state = {
    openStageForm: false,
    openPartnerForm: false,
    openContactForm: false,
    selectedStage: undefined,
    selectedPartner: undefined,
    selectedContact: undefined
  };

  handleOrder = result => {
    const { source, destination, draggableId, type } = result;
    const { updatePartner, moveContactToPartner } = this.props;

    if (!destination) {
      return null;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return null;
    }

    if (destination.droppableId !== source.droppableId) {
      if (type === 'CARD') {
        return updatePartner({ id: draggableId, stageId: destination.droppableId });
      }

      if (type === 'CONTACT') {
        return moveContactToPartner({
          id: source.droppableId,
          toPartner: destination.droppableId,
          contactId: draggableId
        });
      }
    }
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

  handleAddPartner = stage => {
    this.setState({ openPartnerForm: true, selectedStage: stage });
  };

  handleEditPartner = partner => {
    this.setState({ openPartnerForm: true, selectedPartner: partner });
  };

  handlePartnerFormResult = async result => {
    const { createPartner, updatePartner } = this.props;

    if (result) {
      const data = {
        name: result.name,
        url: result.url.length > 0 ? result.url : null,
        goals: result.goals.length > 0 ? result.goals : null,
        stageId: result.stageId
      };

      if (result.id) {
        await updatePartner({ id: result.id, ...data });
      } else {
        await createPartner(data);
      }
    }

    this.setState({ openPartnerForm: false, selectedStage: undefined, selectedPartner: undefined });
  };

  handleDeletePartner = ({ id }) => {
    const { deletePartner } = this.props;
    deletePartner({ id });
  };

  handleAddContact = partner => {
    this.setState({ openContactForm: true, selectedPartner: partner });
  };

  handleEditContact = contact => {
    this.setState({ openContactForm: true, selectedContact: contact });
  };

  handleContactFormResult = async result => {
    const { createContact, updateContact, addContactToPartner } = this.props;

    if (result) {
      const data = {
        name: result.name,
        email: result.email.length > 0 ? result.email : null,
        phone: result.phone.length > 0 ? result.phone : null
      };

      if (result.id) {
        await updateContact({ id: result.id, ...data });
      } else {
        const {
          data: { contact }
        } = await createContact(data);

        await addContactToPartner({ id: result.partnerId, contactId: contact.id });
      }
    }

    this.setState({ openContactForm: false, selectedPartner: undefined, selectedContact: undefined });
  };

  render() {
    const { columns = [], classes } = this.props;
    const {
      openStageForm,
      selectedStage,
      openPartnerForm,
      selectedPartner,
      openContactForm,
      selectedContact
    } = this.state;

    return (
      <div className={classes.root}>
        <GridColumn list={columns} onDragEnd={this.handleOrder}>
          {({ item: column }) => {
            return (
              <Column
                id={column.id}
                title={column.title}
                list={column.cards}
                index={column.index}
                onEditColumn={this.handleEditStage.bind(this, column.data)}
                onDeleteColumn={this.handleDeleteStage.bind(this, column.data)}
                onAddCard={this.handleAddPartner.bind(this, column.data)}
              >
                {({ item: card }) => {
                  return (
                    <Card
                      id={card.id}
                      title={card.title}
                      index={card.index}
                      data={card.data}
                      onEditCard={this.handleEditPartner.bind(this, card.data)}
                      onAddContact={this.handleAddContact.bind(this, card.data)}
                      onEditContact={this.handleEditContact}
                      onDeleteContact={this.handleDeleteContact}
                    />
                  );
                }}
              </Column>
            );
          }}
        </GridColumn>
        <Button
          variant="fab"
          color="primary"
          aria-label="Add"
          className={classes.addCardButton}
          onClick={this.handleAddStage}
        >
          <AddIcon />
        </Button>
        <StageForm open={openStageForm} stage={selectedStage} onClose={this.handleStageFormResult} />
        <PartnerForm
          open={openPartnerForm}
          stage={selectedStage}
          partner={selectedPartner}
          onClose={this.handlePartnerFormResult}
        />
        <ContactForm
          open={openContactForm}
          partner={selectedPartner}
          contact={selectedContact}
          onClose={this.handleContactFormResult}
        />
      </div>
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
  graphql(GET_ALL_PARTNERS, {
    skip({ services = [] }) {
      return !services.find(s => s.type === 'orgs');
    },
    options: {
      context: {
        serviceType: 'orgs'
      },
      fetchPolicy: 'cache-and-network'
    },
    props({ data: { partners = [], stages = [], loading } }) {
      return {
        columns: updateKanban({
          stages,
          partners
        }),
        partners,
        stages,
        loading
      };
    }
  }),
  graphql(CREATE_PARTNER, {
    props({ mutate }) {
      return {
        createPartner: variables => {
          return mutate({
            variables,
            context: {
              serviceType: 'orgs'
            },
            update(
              cache,
              {
                data: { partner }
              }
            ) {
              const { partners, ...data } = cache.readQuery({ query: GET_ALL_PARTNERS });
              cache.writeQuery({
                query: GET_ALL_PARTNERS,
                data: { ...data, partners: partners.concat([partner]) }
              });
            }
          });
        }
      };
    }
  }),
  graphql(UPDATE_PARTNER, {
    props({ mutate, ownProps: { partners, stages } }) {
      return {
        updatePartner: (variables, optimistic = true) => {
          return mutate({
            variables,
            context: {
              serviceType: 'orgs'
            },
            optimisticResponse: optimistic ? updatePartnerOptimistic({ partners, stages }, variables) : null
          });
        }
      };
    }
  }),
  graphql(CREATE_CONTACT, {
    options: {
      refetchQueries: [
        {
          query: GET_ALL_PARTNERS,
          context: {
            serviceType: 'orgs'
          }
        }
      ]
    },
    props({ mutate }) {
      return {
        createContact: variables => {
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
  graphql(UPDATE_CONTACT, {
    options: {
      refetchQueries: [
        {
          query: GET_ALL_PARTNERS,
          context: {
            serviceType: 'orgs'
          }
        }
      ]
    },
    props({ mutate }) {
      return {
        updateContact: variables => {
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
  graphql(DELETE_PARTNER, {
    options: {
      refetchQueries: [
        {
          query: GET_ALL_PARTNERS,
          context: {
            serviceType: 'orgs'
          }
        }
      ]
    },
    props({ mutate }) {
      return {
        deletePartner: variables => {
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
  graphql(ADD_CONTACT_TO_PARTNER, {
    props({ mutate }) {
      return {
        addContactToPartner: variables => {
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
  graphql(MOVE_CONTACT_TO_PARTNER, {
    props({ mutate, ownProps: { partners } }) {
      return {
        moveContactToPartner: variables => {
          return mutate({
            variables,
            context: {
              serviceType: 'orgs'
            },
            optimisticResponse: updateContactToPartnerOtimistic({ partners }, variables)
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
              const { stages, ...data } = cache.readQuery({ query: GET_ALL_PARTNERS });
              cache.writeQuery({
                query: GET_ALL_PARTNERS,
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
            variables,
            context: {
              serviceType: 'orgs'
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
          query: GET_ALL_PARTNERS,
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
  withStyles(styles)
)(Kanban);
