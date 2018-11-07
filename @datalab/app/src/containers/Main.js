import React, { Component, Fragment } from 'react';
import { compose, graphql, withApollo } from 'react-apollo';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import { GET_SERVICES, getType } from '../stores/board';
import {
  GET_ALL_PARTNERS,
  UPDATE_PARTNER,
  CREATE_STAGE,
  UPDATE_STAGE,
  DELETE_STAGE,
  updatePartnerOptimistic,
  updateKanban
} from '../stores/orgs';

import GridColumn from '../components/dnd/GridColumn';
import Column from '../components/dnd/Column';
import Card from '../components/dnd/Card';
import StageForm from '../components/modal/StageForm';

const styles = () => ({
  addCardButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%'
  }
});

class Main extends Component {
  state = {
    openStageForm: false,
    selectedStage: null
  };

  handleOrder = result => {
    const { source, destination, draggableId } = result;
    const { updatePartner } = this.props;

    if (!destination) {
      return null;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return null;
    }

    if (destination.droppableId !== source.droppableId) {
      const { droppableId } = destination;
      return updatePartner({ id: draggableId, stageId: droppableId });
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

    this.setState({ openStageForm: false, selectedStage: null });
  };

  handleDeleteStage = ({ id }) => {
    const { deleteStage } = this.props;
    deleteStage({ id });
  };

  render() {
    const { columns = [], loading, classes } = this.props;
    const { openStageForm, selectedStage } = this.state;

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
                  index={column.index}
                  onEditColumn={this.handleEditStage.bind(this, column.data)}
                  onDeleteColumn={this.handleDeleteStage.bind(this, column.data)}
                >
                  {({ item: card }) => {
                    return <Card id={card.id} title={card.title} index={card.index} data={card.data} />;
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
          onClick={this.handleAddStage}
        >
          <AddIcon />
        </Button>
        <StageForm open={openStageForm} stage={selectedStage} onClose={this.handleStageFormResult} />
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
  graphql(UPDATE_PARTNER, {
    props({ mutate, ownProps: { partners, stages } }) {
      return {
        updatePartner: variables => {
          return mutate({
            variables,
            context: {
              serviceType: 'orgs'
            },
            optimisticResponse: updatePartnerOptimistic({ partners, stages }, variables)
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
)(Main);
