import React, { Component } from 'react';
import { compose, graphql, withApollo } from 'react-apollo';

import { GET_COLUMNS, UPDATE_CARD_ORDER, GET_SERVICES } from '../stores/board';
import { GET_MESSAGES } from '../stores/messaging';
import { GET_TASKS, TOGGLE_TASK } from '../stores/tasks';
import GridColumn from '../components/dnd/GridColumn';
import Column from '../components/dnd/Column';
import Card from '../components/dnd/Card';

class Main extends Component {
  handleOrder = result => {
    const { source, destination, draggableId } = result;
    const { updateCardOrder } = this.props;

    return updateCardOrder(source, destination, draggableId);
  };

  render() {
    const { columns, messages = null, tasks = null, toggleTask } = this.props;

    return (
      <GridColumn list={columns} onDragEnd={this.handleOrder}>
        {({ item: column }) => {
          return (
            <Column id={column.id} title={column.title} list={column.cards}>
              {({ item: card, key }) => {
                const cardMessages = messages ? messages.filter(m => m.to === card.id) : null;
                const cardTasks = tasks ? tasks.filter(m => m.to === card.id) : null;
                return (
                  <Card
                    id={card.id}
                    title={card.title}
                    index={key}
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
    );
  }
}

export default compose(
  withApollo,
  graphql(GET_COLUMNS, {
    props({ data: { columns = [] } }) {
      return { columns };
    }
  }),
  graphql(UPDATE_CARD_ORDER, {
    props({ mutate }) {
      return {
        updateCardOrder: (source, destination, cardId) => {
          return mutate({
            variables: {
              source,
              destination,
              cardId
            }
          });
        }
      };
    }
  }),
  graphql(GET_SERVICES, {
    props({ data: { services = [] }, ownProps: { client } }) {
      // return for now only the enabled services
      client.updateServices(services);
      return { services: services.filter(s => s.enabled) };
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
  })
)(Main);
