import React, { Component, Fragment } from 'react';
import { compose, graphql, withApollo } from 'react-apollo';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import { GET_SERVICES, getType } from '../stores/board';
import { GET_ALL_PARTNERS, UPDATE_PARTNER, updatePartnerOptimistic, updateKanban } from '../stores/orgs';

import GridColumn from '../components/dnd/GridColumn';
import Column from '../components/dnd/Column';
import Card from '../components/dnd/Card';
import FormStage from '../components/modal/FormStage';

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
    stageId: null
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
      return updatePartner({ id: draggableId, stageId: destination.droppableId });
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

  render() {
    const { columns = [], loading, classes } = this.props;
    const { openFormStage } = this.state;

    return (
      <Fragment>
        {loading ? (
          'loading'
        ) : (
          <GridColumn list={columns} onDragEnd={this.handleOrder}>
            {({ item: column }) => {
              return (
                <Column id={column.id} title={column.title} list={column.cards} index={column.index}>
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
          onClick={this.handleOpenFormStage}
        >
          <AddIcon />
        </Button>
        <FormStage open={openFormStage} onClose={this.handleFormStageResult} />
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
  withStyles(styles)
)(Main);
