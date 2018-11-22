import React, { Component } from 'react';
import { compose, graphql, withApollo } from 'react-apollo';

import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';

import GraphIcon from '@material-ui/icons/BubbleChart';
import KanbanIcon from '@material-ui/icons/InsertChart';
import ListIcon from '@material-ui/icons/GridOn';

import { GET_SERVICES, getType } from '../stores/board';
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
  updateContactToPartnerOtimistic
} from '../stores/orgs';
import { SPELLCHECK } from '../stores/spellcheck';

import StageForm from '../components/modal/StageForm';
import PartnerForm from '../components/modal/PartnerForm';
import ContactForm from '../components/modal/ContactForm';

import Graph from '../components/partners/Graph';
import Kanban from '../components/partners/Kanban';
import List from '../components/partners/List';

const styles = theme => ({
  root: {},
  viewIcon: {
    paddingRight: theme.spacing.unit
  }
});

class Partners extends Component {
  state = {
    selectedView: 0,
    anchorEl: null,
    openStageForm: false,
    openPartnerForm: false,
    openContactForm: false,
    selectedStage: undefined,
    selectedPartner: undefined,
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

  handleViewMenuShow = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleViewMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  handleSelectViewChange = (event, index) => {
    this.setState({ selectedView: index, anchorEl: null });
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
        stageId: result.stage.value
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

  handleSpellcheck = variables => {
    const { client } = this.props;
    return client.query({
      query: SPELLCHECK,
      context: {
        serviceType: 'spellcheck',
        useNetworkStatusNotifier: false
      },
      variables,
      fetchPolicy: 'network-only'
    });
  };

  render() {
    const { classes, partners = [], stages = [], updatePartner, moveContactToPartner } = this.props;
    const {
      selectedView,
      anchorEl,
      openStageForm,
      selectedStage,
      openPartnerForm,
      selectedPartner,
      openContactForm,
      selectedContact
    } = this.state;
    const selectedViewCfg = this.views[selectedView];
    const SelectedView = selectedViewCfg.Component;
    const SelectedViewIcon = selectedViewCfg.Icon;

    return (
      <div className={classes.root}>
        <Toolbar>
          <Button onClick={this.handleViewMenuShow}>
            <SelectedViewIcon className={classes.viewIcon} />
            {selectedViewCfg.title}
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleViewMenuClose}>
            {this.views.map(({ title, Icon }, index) => (
              <MenuItem
                key={title}
                onClick={event => this.handleSelectViewChange(event, index)}
                selected={index === selectedView}
              >
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText>{title}</ListItemText>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
        <SelectedView
          partners={partners}
          stages={stages}
          onAddPartner={this.handleAddPartner}
          onEditPartner={this.handleEditPartner}
          onDeletePartner={this.handleDeletePartner}
          onAddContact={this.handleAddContact}
          onEditContact={this.handleEditContact}
          onDeleteContact={this.handleDeleteContact}
          onAddStage={this.handleAddStage}
          onEditStage={this.handleEditStage}
          onDeleteStage={this.handleDeleteStage}
          // TODO(elmasse): Review these 2 used by handleOrder in Kanban view.
          moveContactToPartner={moveContactToPartner}
          updatePartner={updatePartner}
        />
        <StageForm open={openStageForm} stage={selectedStage} onClose={this.handleStageFormResult} />
        <PartnerForm
          open={openPartnerForm}
          partner={selectedPartner}
          stage={selectedStage}
          stages={[{ id: null, name: 'Uncategorized' }, ...stages]}
          onClose={this.handlePartnerFormResult}
          onSpellcheck={this.handleSpellcheck}
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
              serviceType: 'orgs',
              useNetworkStatusNotifier: !optimistic
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
              serviceType: 'orgs',
              useNetworkStatusNotifier: false
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
)(Partners);
